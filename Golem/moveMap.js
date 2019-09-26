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
}

function updateToolbarColors(player) {
    for (var i = 1; i <= gameVars.globalGameOptions.totalPlayers; i++) {
        removeClass("map-screen-toolbar", "not-attackable" + i);
        removeClass("battle-screen-toolbar", "not-attackable" + i);
        removeClass("intro-screen-toolbar", "not-attackable" + i);
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

function moveComplete() {
    var currentTurnPlayerName = findPlayerName(gameVars.gameStatus.turn),
    moveConfirmation = confirm(currentTurnPlayerName + " is done moving?");

    if (moveConfirmation === true) {
    //future version - continent owned bonus
    //check for continent owned color

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
    //end the turn
    setEndOfTurn();
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
    //remove button
    removeElement("map-screen-toolbar", "cancel-move");
    //clear map select from all countries
    removeAllClassFromMapbuttons("map-select");
}

function moveDecksBetweenCounries(country1, country2) {
    var fullCountry1 = findFullCountryWithCountry(country1),
    fullCountry2 = findFullCountryWithCountry(country2),
    tempDeck = {};
   
    //make cancel move button
    removeElement("map-screen-toolbar", "cancel-move");
    addElement("map-screen-toolbar", "button", "Reset Map", "cancel-move", "map-button", cancelMoves);

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

function makeMove(country) {
    var fullCountry = findFullCountryWithCountry(country),
    countryBorders = fullCountry.borders,
    currentTurn = gameVars.gameStatus.turn,
    countryPlayer = findCountryPlayer(country);

    //if country is owned by current player
    if (gameVars.mapInfo.mapSelect.length === 0 && currentTurn === countryPlayer && availableCountryMove() === true) {
        //clear map select from all countries
        removeAllClassFromMapbuttons("map-select");
        //if click is next to previous click
        if (isItemInArray(gameVars.mapInfo.mapSelect[0], countryBorders)) {
            //push to map select
            gameVars.mapInfo.mapSelect.push(country);
            //switch decks on two countries
            moveDecksBetweenCounries(gameVars.mapInfo.mapSelect[0], gameVars.mapInfo.mapSelect[1]);
            //rebuild map buttons
            buildMapButtons();
            //mark as move selected
            addClass(country, "map-select");
            //clear map select
            gameVars.mapInfo.mapSelect = [];
        }
        else {
            //clear map select
            gameVars.mapInfo.mapSelect = [];
            //push to map select
            gameVars.mapInfo.mapSelect.push(country);
            //mark as move selected
            addClass(country, "map-select");
        }
    }
    else if (gameVars.mapInfo.mapSelect.length === 1 && availableCountryMove() === true) {
        if (!!fullCountry.deck === false || isItemInArray(gameVars.mapInfo.mapSelect[0], countryBorders)) {
            //push to map select
            gameVars.mapInfo.mapSelect.push(country);
            //check for available moves
            if (availableCountryMove() === true) {
                //switch decks on two countries
                moveDecksBetweenCounries(gameVars.mapInfo.mapSelect[0], gameVars.mapInfo.mapSelect[1]);
                //rebuild map buttons
                buildMapButtons();
                //clear map select
                gameVars.mapInfo.mapSelect = [];
                //clear map select from all countries
                removeAllClassFromMapbuttons("map-select");
            }
        }
    }
    else if (gameVars.mapInfo.mapSelect.length === 1) {
        if (currentTurn === findCountryPlayer(gameVars.mapInfo.mapSelect[0])) {
            //push to map select
            gameVars.mapInfo.mapSelect.push(country);
            //switch decks on two countries
            moveDecksBetweenCounries(gameVars.mapInfo.mapSelect[0], gameVars.mapInfo.mapSelect[1]);
            //mark as move selected
            addClass(country, "map-select");
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
    //clear map moves
    gameVars.mapInfo.mapMoves = 0;
    //load reinforcement and continent moves to map moves
    countMapMoves();
    //backup country list for cancel move button
    backupCountryList();
    //make move complete button
    addElement("map-screen-toolbar", "button", "Move Complete", "complete-move", "map-button", moveComplete);
    //update map note and message
    document.getElementById("map-message").innerHTML = findPlayerName(gameVars.gameStatus.turn) + " Choose Move";
    document.getElementById("map-note").innerHTML = "Moves Remaining: " + gameVars.mapInfo.mapMoves;
    //update mode
    gameVars.gameStatus.mode = "move";
}

function isMovable(country) {
    var fullCountry = findFullCountryWithCountry(country),
    currentTurn = gameVars.gameStatus.turn;

    //movable if country owned by current turn player or next to empty or current turn player
    for (var i = 0; i < fullCountry.borders.length; i++) {
        var borderFullCountry = findFullCountryWithCountry(fullCountry.borders[i]);

        if (!!fullCountry.deck) {
            var countryPlayer = findCountryPlayer(country);

            if (countryPlayer === currentTurn) {
                if (!!borderFullCountry.deck && borderFullCountry.deck.deckPlayer === currentTurn) {
                    return true;
                }
                else if (!!borderFullCountry.deck === false) {
                    return true;
                }
            }
        }
        else {
            if (!!borderFullCountry.deck && borderFullCountry.deck.deckPlayer === currentTurn) {
                return true;
            }
        }
    }
    return false;
}