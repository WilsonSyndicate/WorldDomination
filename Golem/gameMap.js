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

function attackCountryClicked(country) {
    var currentTurnPlayer = gameVars.gameStatus.turn,
    currentTurnPlayerName = gameVars.playerInfo["player" + currentTurnPlayer].playerName,
    currentClick = gameVars.mapInfo.mapSelect.length,
    countryDeck = findDeckWithCountry(country),
    countryBorders = gameVars.mapInfo.countryList[findCountryRef(country)].borders;

    if (!!countryDeck) {
        var countryPlayer = countryDeck.deckPlayer,
        countryDeckName = shownDeckName(countryPlayer, countryDeck.deckName);

        if (currentTurnPlayer === countryPlayer) {
            //clear previous selection
            removeAllClassFromMapbuttons("attack-threat");
            removeAllClassFromMapbuttons("join-threat");
            //add deck to mapSelect
            gameVars.mapInfo.mapSelect = [countryDeck];
            //update message and note
            document.getElementById("map-message").innerHTML = currentTurnPlayerName + " Choose Country To Attack";
            document.getElementById("map-note").innerHTML = countryDeckName + " attacks... ";
            //highlight border countries not controlled by curentTurnPlayer as attack threat
            for (var i = 0; i < countryBorders.length; i++) {
                var checkForDeck = !!findFullCountryWithCountry(countryBorders[i]).deck;

                if (checkForDeck && findFullCountryWithCountry(countryBorders[i]).deck.deckPlayer !== currentTurnPlayer) {
                    addClass(countryBorders[i], "attack-threat");
                }
            }
        }
        else {
            switch (currentClick) {
                case 0:
                    document.getElementById("map-note").innerHTML = "Choose one of " + currentTurnPlayerName + "'s decks to attack";
                break;
                case 1:
                    //refactor this and use variables to simplify





                    //if countryclicked borders first click && player is not currentturnplayer
                    var borderingCountryCheck = doesCountryBorderFullCountry(country, findFullCountryWithCountry(findFullCountryWithDeckPlayerAndDeckName(gameVars.mapInfo.mapSelect[0])));
                    
                    if (borderingCountryCheck && currentTurnPlayer !== countryPlayer) {
                        //add deck to map select
                        gameVars.mapInfo.mapSelect.push(countryDeck);
                        //update message and note
                        document.getElementById("map-message").innerHTML = currentTurnPlayerName + " Choose Country To Attack";
                        document.getElementById("map-note").innerHTML = countryDeckName + " attacks... ";
                        //hightlight border countries not controlled by either player as join-threat
                        for (var i = 0; i < countryBorders.length; i++) {
                            var checkForDeck = !!findFullCountryWithCountry(countryBorders[i]).deck;
            
                            if (checkForDeck && mapSelectPlayerNotSelected(countryPlayer)) {
                                addClass(countryBorders[i], "join-threat");
                            }
                        }
                        //add button to accept attack
                    }
                break;
                case 2:
    
                break;
                default:
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
    //refreshMapButtonColors();
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