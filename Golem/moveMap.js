//move map
function earthShakingEventCheck() { 
    if (gameVars.mapInfo.possibleAttack === 0) {
        alert("No attacks within range for " + findPlayerName(gameVars.gameStatus.turn));
        earthShakingEvent();
    }
}

function earthShakingEvent() {
    //set to move
    setToMove();
    //show map
    showMap();
    //rebuild map buttons
    buildMapButtons();
    //rebuild hero and conspiracy
    shuffleHeroAndConspiracy();
}

function updateToolbarColors(player) {
    for (var i = 1; i <= gameVars.globalGameOptions.totalPlayers; i++) {
        removeClass("map-screen-toolbar", "player-color-" + i);
        removeClass("battle-screen-toolbar", "player-color-" + i);
        removeClass("intro-screen-toolbar", "player-color-" + i);
    }
    addClass("map-screen-toolbar", "player-color-" +player);
    addClass("battle-screen-toolbar", "player-color-" +player);
    addClass("intro-screen-toolbar", "player-color-" +player);
}

function setEndOfTurn() {
    //set mode
    gameVars.gameStatus.mode = "attack"
    //set next turn
    gameVars.gameStatus.turn = getNextTurn();
    //go to intro
    showIntro();
    //update toolbar colors
    updateToolbarColors(gameVars.gameStatus.turn)
}

function clearContinentOwnedList() {
    var newArray = [];

    for (var i = 0; i < gameVars.mapInfo.continentsOwned.length; i++) {
        if (gameVars.mapInfo.continentsOwned[i][1] !== gameVars.gameStatus.turn) {
            newArray.push(gameVars.mapInfo.continentsOwned[i]);
        }
    }
    gameVars.mapInfo.continentsOwned = newArray;
}

function controlledContinentUpdate() {
    var continentWithCountryList = continentsWithCountries(),
    colorPrompt = false;

    //clear previous controlled and owned list
    gameVars.mapInfo.continentsControlled = [];
    //remove current player from owned list
    clearContinentOwnedList();
    //for each continent
    for (var i = 0; i < continentWithCountryList.length; i++) {
        var currentContinent = continentWithCountryList[i][0],
        currentContinentPlayerList = [];

        //check player numbers on each country
        for (var y = 1; y < continentWithCountryList[i].length; y++) {
            var currentCountry = continentWithCountryList[i][y];

            if (!!findFullCountryWithCountry(currentCountry).deck) {
                //and add to current list
                currentContinentPlayerList.push(findCountryPlayer(currentCountry));
            }
        }
        //if list has only one player mark as controlled
        if (findUniqueValuesInArray(currentContinentPlayerList).length === 1) {
            var currentControllerPlayer = findUniqueValuesInArray(currentContinentPlayerList)[0];
            gameVars.mapInfo.continentsControlled.push([currentContinent, currentControllerPlayer]);

            //if list has only one player and deck totals = country totals mark as owned
            if (currentContinentPlayerList.length === numberOfCountriesOnContinent(continentWithCountryList[i][0]) && gameVars.gameStatus.turn === currentControllerPlayer) {
                //add current player to owned list
                gameVars.mapInfo.continentsOwned.push([currentContinent, currentControllerPlayer]);
                colorPrompt = true;
            }
        }
    }
    return colorPrompt;
}

function undisableAllColorButtons() {
    undisableId("choice-w")
    undisableId("choice-u")
    undisableId("choice-b")
    undisableId("choice-r")
    undisableId("choice-g")
}

function disableContinentColorButton(continent) {
    switch (continent) {
        case "North America":
            disableId("choice-w");
        break;
        case "Europe":
            disableId("choice-u");
        break
        case "Africa":
            disableId("choice-b");
        break;
        case "Australia":
            disableId("choice-r");
        break;
        case "Asia":
            disableId("choice-g");
        break;
    }
}

function continentColorChoice(color) {
    //update color
    for (var i = 0; i < gameVars.mapInfo.continentsOwned.length; i++) {
        if (gameVars.mapInfo.continentsOwned[i] === gameVars.mapInfo.continentTemp[0]) {
            gameVars.mapInfo.continentsOwned[i].push(color);
            //update temp continent reference
            gameVars.mapInfo.continentTemp = removeItemFromArray(gameVars.mapInfo.continentTemp[0], gameVars.mapInfo.continentTemp);
            //hide prompt
            hideId("continent-color-prompt");
            break;
        }
    }
    //go back to color prompt
    continentColorPrompt()
}

function continentColorPrompt() {
    //clear temp
    gameVars.mapInfo.continentTemp = [];
    //build temp
    for (var i = 0; i < gameVars.mapInfo.continentsOwned.length; i++) {
        if (gameVars.mapInfo.continentsOwned[i][1] === gameVars.gameStatus.turn && gameVars.mapInfo.continentsOwned[i].length === 2) {
            //update temp list
            gameVars.mapInfo.continentTemp.push(gameVars.mapInfo.continentsOwned[i]);
        }
    }
    if (gameVars.mapInfo.continentTemp.length > 0) {
        //unhide color prompt
        unhideId("continent-color-prompt");
        //update text
        document.getElementById("color-choice-text").innerHTML = "Please choose a color to add to " + gameVars.mapInfo.continentTemp[0][0];
        //undisable all color buttons
        undisableAllColorButtons();
        //disable current continent color button
        disableContinentColorButton(gameVars.mapInfo.continentTemp[0][0]);
    }
    else {
        //hide color prompt
        hideId("continent-color-prompt");
        //end the turn
        setEndOfTurn();
    }
}

function moveComplete() {
    var currentTurnPlayerName = findPlayerName(gameVars.gameStatus.turn),
    moveConfirmation = confirm(currentTurnPlayerName + " is done moving?");

    if (moveConfirmation === true) {
        //remove drop button
        removeElement("map-screen-toolbar", "supply-drop-button");
        //remove map buttons
        removeElement("map-screen-toolbar", "complete-move");
        removeElement("map-screen-toolbar", "cancel-move");
        removeElement("map-screen-toolbar", "supply-drop-button");
        //cleanup battlescreen info
        gameVars.battleScreenInfo.eliminatedDeck = "";
        //cleanup map info
        gameVars.mapInfo.cancelMoveList = [];
        gameVars.mapInfo.alreadyAttacked = [];
        gameVars.mapInfo.joinThreat = [];
        gameVars.mapInfo.mapMoves = 0;
        gameVars.mapInfo.mapSelect = [];
        gameVars.mapInfo.possibleAttack = 0;
        gameVars.mapInfo.possibleBattle = [];
        if (adminSettings.continentBonuses.useContinentBonuses && controlledContinentUpdate()) {
            continentColorPrompt();
        }
        else {
            setEndOfTurn();

        }
    }
}

function backupCountryList() {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (!!gameVars.mapInfo.countryList[i].deck){
            gameVars.mapInfo.cancelMoveList.push(gameVars.mapInfo.countryList[i].deck);
        }
        else {
            gameVars.mapInfo.cancelMoveList.push("noDeck");
        }
    }
}

function countMapMoves() {
    var continentMoves = listOfContinentsPlayerControlsAndOwns(gameVars.gameStatus.turn)[0],
    playerMoves = adminSettings.continentMoves.moveAny;

    if (continentMoves.length > 0) {
        for (var i = 0; i < continentMoves.length; i++) {
            var currentMoveContinent = "move" + continentMoves[i],
            currentMoveContinentMoves = adminSettings.continentMoves[currentMoveContinent];
    
            playerMoves += currentMoveContinentMoves;
        }
    }
    gameVars.mapInfo.mapMoves = playerMoves;
}

function cancelMoves() {
    //set country list to cancel move list
    for (var i = 0; i < gameVars.mapInfo.cancelMoveList.length; i++) {
        if (!!gameVars.mapInfo.countryList[i].deck) {
            delete gameVars.mapInfo.countryList[i].deck;
        } 
        if (gameVars.mapInfo.cancelMoveList[i] !== "noDeck") {
            gameVars.mapInfo.countryList[i].deck = gameVars.mapInfo.cancelMoveList[i];
        }
    }
    //refresh map buttons
    buildMapButtons();
    //reset move count
    countMapMoves();
    //disable button
    disableId("cancel-move");
    //clear map select from all countries
    removeAllClassFromMapbuttons("map-select");
}

function moveDecksBetweenCounries(country1, country2) {
    var fullCountry1 = findFullCountryWithCountry(country1),
    fullCountry2 = findFullCountryWithCountry(country2),
    tempDeck = {};

    if (!!fullCountry2.deck) {
        tempDeck = fullCountry1.deck;
        fullCountry1.deck = fullCountry2.deck;
        fullCountry2.deck = tempDeck;
    }
    else {
        fullCountry2.deck = fullCountry1.deck;
        delete fullCountry1.deck;
    }
    gameVars.mapInfo.mapMoves -= 1;
}

function availableCountryMove() {
    if (gameVars.mapInfo.mapMoves > 0) {
        return true;
    }
    return false;
}

//if clicking on another country with same player, reset map select
function makeFirstClickMove(country) {
    //push to map select
    gameVars.mapInfo.mapSelect.push(country);
    //mark as move selected
    addClass(country, "map-select");
    //undisable cancel move button
    undisableId("cancel-move");
}

function makeSecondClickMove(country) {
    //push to map select
    gameVars.mapInfo.mapSelect.push(country);
    //switch decks on two countries
    moveDecksBetweenCounries(gameVars.mapInfo.mapSelect[0], gameVars.mapInfo.mapSelect[1]);
    //rebuild map buttons
    buildMapButtons();
    //clear map select
    gameVars.mapInfo.mapSelect = [];
    //clear map select from all countries
    removeAllClassFromMapbuttons("map-select");
}

function makeMove(country) {
    var fullCountry = findFullCountryWithCountry(country),
    countryBorders = fullCountry.borders,
    currentTurn = gameVars.gameStatus.turn,
    countryPlayer = findCountryPlayer(country);

    if (availableCountryMove() === true) {
        if (gameVars.mapInfo.mapSelect.length === 0 && currentTurn === countryPlayer) {
            //first click
            makeFirstClickMove(country);
        }
        else if (gameVars.mapInfo.mapSelect.length === 1 && isItemInArray(gameVars.mapInfo.mapSelect[0], countryBorders)) {
            if (!!fullCountry.deck === false || currentTurn === countryPlayer) {
                //second click
                makeSecondClickMove(country)
            }
        }
        else if (currentTurn === countryPlayer) {
            //clear map select
            gameVars.mapInfo.mapSelect = [];
            //clear map select from all countries
            removeAllClassFromMapbuttons("map-select");
            //first click
            makeFirstClickMove(country);
        }
    }
    document.getElementById("map-note").innerHTML = "Moves Remaining: " + gameVars.mapInfo.mapMoves;
}

function listOfContinentsPlayerControlsAndOwns(player) {
    var allContinents = uniqueListOfContinents(),
    playerControls = [],
    playerOwns = [];

    for (var i = 0; i < allContinents.length; i++) {
        var currentContinent = allContinents[i],
        currentContinentCountryCount = 0,
        currentContinentPlayerCount = 0,
        currentContinentOtherPlayerCount = 0;

        for (var n = 0; n < gameVars.mapInfo.countryList.length; n++) {
            var currentFullCountry = gameVars.mapInfo.countryList[n];

            if (currentFullCountry.continent === currentContinent) {
                currentContinentCountryCount += 1;

                if (!!currentFullCountry.deck) {
                    if (currentFullCountry.deck.deckPlayer === player) {
                        currentContinentPlayerCount  += 1;
                    }
                    else {
                        currentContinentOtherPlayerCount += 1;
                    }
                }
            }
        }
        if (currentContinentOtherPlayerCount === 0 && currentContinentPlayerCount > 0) {
            playerControls.push(currentContinent);
        }
        if (currentContinentPlayerCount === currentContinentCountryCount) {
            playerOwns.push(currentContinent);
        }
    }
    return [playerControls, playerOwns];
}

function uniqueListOfContinents() {
    var continentList = [];

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        continentList.push(gameVars.mapInfo.countryList[i].continent);
    }
    return findUniqueValuesInArray(continentList);
}

function setToMove() {
    //remove decline attack button
    removeElement("map-screen-toolbar", "decline-attack");
    //remove confirm attack button
    removeElement("map-screen-toolbar", "confirm-attack");
    //remove supply drop button
    removeElement("map-screen-toolbar", "supply-drop-button");
    //clear map moves
    gameVars.mapInfo.mapMoves = 0;
    //load reinforcement and continent moves to map moves
    countMapMoves();
    //backup country list for cancel move button
    backupCountryList();
    //make move complete button
    addElement("map-screen-toolbar", "button", "Move Complete", "complete-move", "map-button", moveComplete);
    addClass("complete-move", "btn");
    addClass("complete-move", "btn-primary");
    //make reset move button and disable
    addElement("map-screen-toolbar", "button", "Reset Map", "cancel-move", "map-button", cancelMoves);
    addClass("cancel-move", "btn");
    addClass("cancel-move", "btn-danger");
    disableId("cancel-move");
    //update map note and message
    document.getElementById("map-message").innerHTML = findPlayerName(gameVars.gameStatus.turn) + " Choose Move";
    document.getElementById("map-note").innerHTML = "Moves Remaining: " + gameVars.mapInfo.mapMoves;
    //update mode
    gameVars.gameStatus.mode = "move";
}

function isMovable(country) {
    var fullCountry = findFullCountryWithCountry(country),
    currentTurn = gameVars.gameStatus.turn;

    //movable if country owned by current turn player is next to empty or current turn player
    if (!!fullCountry.deck && fullCountry.deck.deckPlayer === currentTurn) {
        for (var i = 0; i < fullCountry.borders.length; i++) {
            var borderFullCountry = findFullCountryWithCountry(fullCountry.borders[i]);

            if (!!borderFullCountry.deck && borderFullCountry.deck.deckPlayer === currentTurn) {
                return true;
            }
            else if (!!borderFullCountry.deck === false) {
                return true
            }
        }
    }
    else if (!!fullCountry.deck === false) {
        for (var c = 0; c < fullCountry.borders.length; c++) {
            var borderFullCountry = findFullCountryWithCountry(fullCountry.borders[c]);

            if (!!borderFullCountry.deck && borderFullCountry.deck.deckPlayer === currentTurn) {
                return true;
            }
        }
    }
    return false;
}