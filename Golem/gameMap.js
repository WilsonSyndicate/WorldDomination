//Game Map

function removeAllClassFromMapbuttons(classToRemove) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        removeClass(gameVars.mapInfo.countryList[i].country, classToRemove);
    }
}

function mapSelectPlayerNotSelected(countryPlayer) {
    for (var i = 0; i < gameVars.mapInfo.mapSelect.length; i++) {
        if (gameVars.mapInfo.mapSelect[i].deckPlayer === countryPlayer) {
            return false;
        }
    }
    return true;
}

function isPlayerNotOnDeckList(player, deckList) {
    for (var i = 0; i < deckList.length; i++) {
        var currentDeckPlayer = deckList[i].deckPlayer;

        if (currentDeckPlayer === player) {
            return false;
        }
    }
    return true;
}

function markToSurroundingPossibleBattle(country, classToAdd) {
    var fullCountry = findFullCountryWithCountry(country),
    playersToExclude = gameVars.mapInfo.mapSelect;
    
    if (!!fullCountry.deck) {
        for (var i = 0; i < fullCountry.borders.length; i++) {
            var currentBorderCountry = fullCountry.borders[i];

            if (!!findFullCountryWithCountry(currentBorderCountry).deck && isPlayerNotOnDeckList(findFullCountryWithCountry(currentBorderCountry).deck.deckPlayer, playersToExclude)) {
                addClass(fullCountry.borders[i], classToAdd);
                gameVars.mapInfo.possibleBattle.push(fullCountry.borders[i]);
            }
        }
    }
}

function isPlayerOnCountry(player, country) {
    if (!!findFullCountryWithCountry(country).deck && findFullCountryWithCountry(country).deck.deckPlayer === player) {
        return true;
    }
    return false;
}

function selectAttacker(country, countryDeck, currentTurnPlayerName, countryDeckName) {
    //remove all attack classes
    removeAllClassFromMapbuttons("attack-threat");
    removeAllClassFromMapbuttons("join-threat");
    removeAllClassFromMapbuttons("map-attack");
    removeAllClassFromMapbuttons("map-defend");
    removeAllClassFromMapbuttons("map-join");

    //remove button to accept attack
    removeElement("map-screen-toolbar", "confirm-attack");

    //clear ground zero
    gameVars.battleScreenInfo.groundZero = "";

    //make mapSelect = deck on country clicked
    gameVars.mapInfo.mapSelect = [countryDeck];

    //highlight as attacker
    addClass(country, "map-attack");

    //add bordering countries with deck and not same player as on map select as possible battle and highlight as possible attack
    gameVars.mapInfo.possibleBattle = [];
    markToSurroundingPossibleBattle(country, "attack-threat");

    //update map message and note with countryDeckName
    document.getElementById("map-message").innerHTML = currentTurnPlayerName + " Choose Country To Attack";
    document.getElementById("map-note").innerHTML = countryDeckName + " attacks... ";
}

function selectDefender(country, countryPlayer, countryDeckName) {
    removeAllClassFromMapbuttons("join-threat");

    //add button to accept attack
    addElement("map-screen-toolbar", "button", "Confirm Attack", "confirm-attack", "attack-button", attackChosen);

    //highlight as defender
    addClass(country, "map-defend");

    //remove attack threat class
    removeAllClassFromMapbuttons("attack-threat");

    //set ground zero
    gameVars.battleScreenInfo.groundZero = country;

    //push to mapSelect
    gameVars.mapInfo.mapSelect.push({deckPlayer: countryPlayer, deckName: countryDeckName});

    //add bordering countries with deck and not same player as on map select as possible battle and highlight as possible joiner
    gameVars.mapInfo.possibleBattle = [];
    markToSurroundingPossibleBattle(country, "join-threat");
}

function selectJoiner(country, countryPlayer, countryDeckName) {
    removeAllClassFromMapbuttons("join-threat");

    //highlight as joiner
    addClass(country, "map-join");

    //push to mapSelect
    gameVars.mapInfo.mapSelect.push({deckPlayer: countryPlayer, deckName: countryDeckName});

    //add bordering countries with deck and not same player as on map select as possible battle and highlight as possible joiner
    gameVars.mapInfo.possibleBattle = [];
    markToSurroundingPossibleBattle(gameVars.battleScreenInfo.groundZero, "join-threat");
}

function attackCountryClicked(country) {
    var currentTurnPlayer = gameVars.gameStatus.turn,
    currentTurnPlayerName = gameVars.playerInfo["player" + currentTurnPlayer].playerName,
    currentClick = gameVars.mapInfo.mapSelect.length,
    countryDeck = findDeckWithCountry(country);

    if (!!countryDeck) {
        var countryPlayer = countryDeck.deckPlayer,
        countryDeckName = shownDeckName(countryPlayer, countryDeck.deckName);

        if (currentTurnPlayer === countryPlayer) {
            selectAttacker(country, countryDeck, currentTurnPlayerName, countryDeckName);

        }
        else if (isItemInArray(country, gameVars.mapInfo.possibleBattle)){
            for (var i = 0; i < gameVars.mapInfo.possibleBattle.length; i++) {
                if (gameVars.mapInfo.possibleBattle[i] === country) {
                    if (currentClick > 1) {
                        selectJoiner(country, countryPlayer, countryDeckName);
                    }
                    else {
                        selectDefender(country, countryPlayer, countryDeckName);
                    }
                }
            }   
        }
    }
}

function mapCountryClick(country) {
    var gameMode = gameVars.gameStatus.mode;

    switch (gameMode) {
        case "attack":
            attackCountryClicked(country);
        break;
        case "placement" :
            console.log(country + " clicked for placement mode")
        break;
        default: console.log("Mode not found in mapCountryClick");
    }
}

function countryMapName(currentCountry) {
    var currentCountryName = currentCountry.countryName,
    hasDeck = !!currentCountry.deck;

    if (hasDeck) {
        var currentPlayerNumber = currentCountry.deck.deckPlayer,
        curentDeckName = currentCountry.deck.deckName,
        currentPlayerName = findPlayerName(currentPlayerNumber),
        isHidden = findDeckWithPlayerNumberAndName(currentPlayerNumber, curentDeckName).deckHidden;  

        if (isHidden) {
            return currentCountryName + "(" + currentPlayerName + ")";
        }
        else {
            return currentCountryName + "(" + currentPlayerName + " playing " + curentDeckName + ")";
        }
    }
    else {
        return currentCountryName;
    }
}

function buildMapButtons() {    
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        var currentFullCountry = gameVars.mapInfo.countryList[i],
        currentCountry = currentFullCountry.country;

        removeElement("map-countries", currentCountry);
        addElement("map-countries", "svg", countryMapName(currentFullCountry), currentCountry, "country-button", mapCountryClick);

        if (!!currentFullCountry.deck) {
            var currentPlayer = currentFullCountry.deck.deckPlayer;

            addClass(currentCountry, "player-color-" + currentPlayer);
        }
    }
}

function beginAttack() {
    var currentTurnPlayerNumber = gameVars.gameStatus.turn,
    currentTurnPlayerName = findPlayerName(currentTurnPlayerNumber);

    if (gameVars.gameStatus.mode === "setup") {
        showPregame();
    }
    else {
        showMap();
        
        //build map buttons
        buildMapButtons();
    
        //update message and note
        document.getElementById("map-message").innerHTML = currentTurnPlayerName + " Choose Your Attack";
        document.getElementById("map-note").innerHTML = "";
    }
}

function topOfTurn() {
    //clear all battle buttons and battle variables
    battleScreenCleanup();

    //change mode
    gameVars.gameStatus.mode = "attack";

    //go to intro screen
    showIntro();
}

function playerCountOnContinent(continent) {
    var playersOnContinent = [];

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        var currentContinent = gameVars.mapInfo.countryList[i].continent,
        isDeck = !!gameVars.mapInfo.countryList[i].deck;

        if (currentContinent === continent && isDeck) {
            playersOnContinent.push(gameVars.mapInfo.countryList[i].deck.deckPlayer);
        }
    }
    return findUniqueValuesInArray(playersOnContinent).length;
}

function setupContinentCheck() {
    var continents = [];

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        var currentContinent = gameVars.mapInfo.countryList[i].continent;
        //for each country push the continent to the continents array
        continents.push(currentContinent);
    }

    //change the continents array to unique values
    continents = findUniqueValuesInArray(continents);

    //if any continent has only 1 player then return true
    for (var c = 0; c < continents.length; c++) {
        if (playerCountOnContinent(continents[c]) === 1) {
            return true;
        }
    }
    return false;
}

function setupMapInformation() {

    //needs to delete all decks off countries here

    var countryCount = gameVars.mapInfo.countryList.length,
    playerCount = gameVars.globalGameOptions.totalPlayers,
    countriesPerPlayer = Math.floor(countryCount/playerCount),
    deckListToAdd = [],
    countryListToAddTo = gameVars.mapInfo.countryList.concat();

    for (var p = 1; p <= playerCount; p++) {
        for (var i = 1; i <= countriesPerPlayer; i++) {
            var currentDeck = gameVars.playerInfo["player" + p].playerDecklist[i].deckUniqueId;
            
            deckListToAdd.push(currentDeck);
        }
    }
    shuffleArray(deckListToAdd);
    shuffleArray(countryListToAddTo);
    for (var c = 0; c < deckListToAdd.length; c++) {
        countryListToAddTo[c].deck = deckListToAdd[c];
    }

    if (setupContinentCheck() === true) {
        setupMapInformation();
    }
    else {
        orderArray(countryListToAddTo, "country")
        gameVars.mapInfo.countryList = countryListToAddTo;
    }
}