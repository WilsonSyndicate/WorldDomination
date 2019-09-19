//Game Map
function declineAttack() {
    var earthShakingEventConfirmed = confirm("Decline Attack?");

    if (earthShakingEventConfirmed) {
        console.log("attack declined");
        earthShakingEvent();
        //remove confirm attack button
        removeElement("map-screen-toolbar", "confirm-attack");
    }
}

function returnNonAttackFromJoiners() {
    //only do so if not attackable
    for (var i = 0; i < gameVars.mapInfo.joinThreat.length; i++) {
        if (isCountryAttackable(gameVars.mapInfo.joinThreat[i]) === false) {
            addClass(gameVars.mapInfo.joinThreat[i], 'not-attackable');
        }
    }
    gameVars.mapInfo.joinThreat = [];
}

function removeNonAttackFromJoiners() {
    returnNonAttackFromJoiners();
    for (var i = 0; i < gameVars.mapInfo.possibleBattle.length; i++) {
        removeClass(gameVars.mapInfo.possibleBattle[i], 'not-attackable');
        gameVars.mapInfo.joinThreat.push(gameVars.mapInfo.possibleBattle[i]);
    }
}

function resetMapScreen() {
    //remove all attack classes
    removeAllClassFromMapbuttons("attack-threat");
    removeAllClassFromMapbuttons("join-threat");
    removeAllClassFromMapbuttons("map-attack");
    removeAllClassFromMapbuttons("map-defend");
    removeAllClassFromMapbuttons("map-join");
    removeAllClassFromMapbuttons("already-attacked");
    //remove button to accept attack
    removeElement("map-screen-toolbar", "confirm-attack");
    //clear map select
    gameVars.mapInfo.mapSelect = [];
}

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
    document.getElementById("map-note").innerHTML = countryDeckName + " attacks ";
}

function selectDefender(country, countryPlayer, countryDeckName) {
    //add button to accept attack
    addElement("map-screen-toolbar", "button", "Confirm Attack", "confirm-attack", "attack-button", attackChosen);
    //highlight as defender
    addClass(country, "map-defend");
    //remove attack and join threat class
    removeAllClassFromMapbuttons("attack-threat");
    removeAllClassFromMapbuttons("join-threat");
    //set ground zero
    gameVars.battleScreenInfo.groundZero = country;
    //push to mapSelect
    gameVars.mapInfo.mapSelect.push({deckPlayer: countryPlayer, deckName: countryDeckName});
    //add bordering countries with deck and not same player as on map select as possible battle and highlight as possible joiner
    gameVars.mapInfo.possibleBattle = [];
    markToSurroundingPossibleBattle(country, "join-threat");
    //update note with deck shown name
    document.getElementById("map-note").innerHTML += shownDeckName(countryPlayer, countryDeckName);
    //unlock joiners
    removeNonAttackFromJoiners();
}

function selectJoiner(country, countryPlayer, countryDeckName) {
    //remove join threats
    removeAllClassFromMapbuttons("join-threat");
    //highlight as joiner
    addClass(country, "map-join");
    //push to mapSelect
    gameVars.mapInfo.mapSelect.push({deckPlayer: countryPlayer, deckName: countryDeckName});
    //add bordering countries with deck and not same player as on map select as possible battle and highlight as possible joiner
    gameVars.mapInfo.possibleBattle = [];
    markToSurroundingPossibleBattle(gameVars.battleScreenInfo.groundZero, "join-threat");
    //update note with deck shown name
    document.getElementById("map-note").innerHTML += " with " + shownDeckName(countryPlayer, countryDeckName);
}

function attackCountryClicked(country) {
    var currentTurnPlayer = gameVars.gameStatus.turn,
    currentTurnPlayerName = gameVars.playerInfo["player" + currentTurnPlayer].playerName,
    currentClick = gameVars.mapInfo.mapSelect.length,
    countryDeck = findDeckWithCountry(country),
    alreadyAttacked = isItemInArray(country, gameVars.mapInfo.alreadyAttacked);

    if (!!countryDeck) {
        var countryPlayer = countryDeck.deckPlayer,
        countryDeckName = shownDeckName(countryPlayer, countryDeck.deckName);

        if (currentTurnPlayer === countryPlayer && alreadyAttacked === false) {
            selectAttacker(country, countryDeck, currentTurnPlayerName, countryDeckName);
            removeNonAttackFromJoiners();
        }
        else if (isItemInArray(country, gameVars.mapInfo.possibleBattle)){
            for (var i = 0; i < gameVars.mapInfo.possibleBattle.length; i++) {
                if (gameVars.mapInfo.possibleBattle[i] === country) {
                    if (currentClick > 1) {
                        selectJoiner(country, countryPlayer, countryDeck.deckName);
                    }
                    else {
                        selectDefender(country, countryPlayer, countryDeck.deckName);
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
        case "move":
            makeMove(country);
        break;
        case "placement":
            //future version - placement
            console.log(country + " clicked for placement mode")
        break;        
        case "drop":
            chooseSupplyDrop(country);
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

function isCountryAttackable(country) {
    var currentFullCountry = findFullCountryWithCountry(country);

    if (!!currentFullCountry.deck) {
        var currentPlayerTurn = gameVars.gameStatus.turn,
        currentCountryPlayer = currentFullCountry.deck.deckPlayer,
        currentCountryBorders = [],
        currentCountryBorderPlayers = [],
        surroundingCountryWithDifferentPlayer = false;

        //remove countries that attacked from border list
        for (var b = 0; b < currentFullCountry.borders.length; b++) {
            var currentBorderCountry = currentFullCountry.borders[b];

            if (!!currentFullCountry.deck && !isItemInArray(currentBorderCountry, gameVars.mapInfo.alreadyAttacked)) {
                var countryBorderFullCountry = findFullCountryWithCountry(currentBorderCountry);

                currentCountryBorders.push(currentBorderCountry);

                if (!!countryBorderFullCountry.deck) {
                    var countryBorderPlayer = countryBorderFullCountry.deck.deckPlayer;

                    currentCountryBorderPlayers.push(countryBorderPlayer);
                }
                
            }
        }
        //does surrounding country have a different player
        for (var c = 0; c < currentCountryBorderPlayers.length; c++) {
            if (currentCountryBorderPlayers[c] !== currentPlayerTurn) {
                surroundingCountryWithDifferentPlayer = true;
            }
        }
        //if deck on country is current player turn 
        if (currentCountryPlayer === currentPlayerTurn) {
            //if deck on country doesnt have a surrounding country with a different player
            if (surroundingCountryWithDifferentPlayer === false) {
                return false;
            }
        }        
        //if deck on country is not current player turn
        else {
            //if a surrounding country doesnt have a deck is current player turn
            if (isItemInArray(currentPlayerTurn, currentCountryBorderPlayers) === false) {
                return false;
            }
        }
        if (!!currentFullCountry.deck && currentPlayerTurn === currentFullCountry.deck.deckPlayer && !isItemInArray(country, gameVars.mapInfo.alreadyAttacked)) {
            gameVars.mapInfo.possibleAttack += 1;
        }
        return true;
    }
}

function buildMapButtons() {    
    //reset possible attack count
    gameVars.mapInfo.possibleAttack = 0;
    gameVars.mapInfo.playableSupply = [];
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        var currentFullCountry = gameVars.mapInfo.countryList[i],
        currentCountry = currentFullCountry.country,
        alreadyAttacked = isItemInArray(currentCountry, gameVars.mapInfo.alreadyAttacked);

        //refresh each country button
        removeElement("map-countries", currentCountry);
        addElement("map-countries", "svg", countryMapName(currentFullCountry), currentCountry, "country-button", mapCountryClick);
        //all check for player color
        if (!!currentFullCountry.deck) {
            var currentPlayer = currentFullCountry.deck.deckPlayer;

            addClass(currentCountry, "player-color-" + currentPlayer);
        }
        //for attack mode only
        if (gameVars.gameStatus.mode === "attack") {
            //check for already attacked
            if (alreadyAttacked === true) {
                addClass(currentCountry, "already-attacked");
            }
            //check for attackable
            removeClass(currentCountry, "not-attackable");
            if (isCountryAttackable(currentCountry) === false) {
                addClass(currentCountry, "not-attackable");  
            }
        }
        else if (gameVars.gameStatus.mode === "move") {
            //check for movable
            if (!isMovable(currentCountry)) {
                addClass(currentCountry, "not-movable");
            }
        }
        else if (gameVars.gameStatus.mode === "drop") {
            //grey out countries already dropped and that cards cant drop
            if (!isSupplyable(currentCountry)) {
                addClass(currentCountry, "not-supplyable");
            }
        }
        else if (gameVars.gameStatus.mode === "placement") {
            //future version
            //map placement
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
   
        //create skip attack button
        addElement("map-screen-toolbar", "button", "Decline Attack", "decline-attack", "map-attack-button", declineAttack);

        //update message and note
        document.getElementById("map-message").innerHTML = currentTurnPlayerName + " Choose Your Attack";
        document.getElementById("map-note").innerHTML = "";

        //earth shaking event check
        earthShakingEventCheck();

        //ignore drop check if recent log shows drop
        if (gameVars.gameLog[gameVars.gameLog.length - 1][1].substr(0, 11) !== "Supply Drop") {
        //drop check and forced drop check
        supplyDropCheck();
        }

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

function removeAllDecksFromCountries() {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (!!gameVars.mapInfo.countryList[i].deck) {
            delete gameVars.mapInfo.countryList[i].deck;
        }
    }
}

function setupMapInformation() {
    var countryCount = gameVars.mapInfo.countryList.length,
    playerCount = gameVars.globalGameOptions.totalPlayers,
    countriesPerPlayer = Math.floor(countryCount/playerCount),
    deckListToAdd = [],
    countryListToAddTo = gameVars.mapInfo.countryList.concat();

    for (var p = 1; p <= playerCount; p++) {
        for (var i = 1; i <= countriesPerPlayer; i++) {
            var currentDeck = gameVars.playerInfo["player" + p].playerDecklist[i].deckUniqueId;
            
            deckListToAdd.push(currentDeck);
            gameVars.playerInfo["player" + p].playerDugout = countriesPerPlayer + 1;
        }
    }
    shuffleArray(deckListToAdd);
    shuffleArray(countryListToAddTo);
    for (var c = 0; c < deckListToAdd.length; c++) {
        countryListToAddTo[c].deck = deckListToAdd[c];
    }
    if (setupContinentCheck() === true) {
        //delete all decks from countries
        removeAllDecksFromCountries();
        //setup again
        setupMapInformation();
    }
    else {
        orderArray(countryListToAddTo, "country")
        gameVars.mapInfo.countryList = countryListToAddTo;
    }
}