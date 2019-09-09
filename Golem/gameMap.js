//Game Map


function mapCountryClick(country) {
    var gameMode = gameVars.gameStatus.mode;

    switch (gameMode) {
        case "attack":
            console.log(country);

        /*
            if (isInArray(country, gameVars.battleScreenInfo.possibleJoinAttack)) {
                console.log(country + " is a joiner");
                //chooseJoiner(country);
            }
            else {
                console.log(country + " is clicked");
                //chooseAttackCountry(country);
            }
            */
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

function topOfTurn() {
    //go to intro screen before map

    //change mode
    gameVars.gameStatus.mode = "attack";

    //change focus
    gameVars.gameStatus.focus = "map";

    //clear all battle buttons and battle variables
    battleScreenCleanup();

    //hide battle screen
    hideId("battle-screen");

    //go to map
    unhideId("map-screen");

    //build map buttons
    buildMapButtons();
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