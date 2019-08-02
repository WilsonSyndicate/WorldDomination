

function settopOfTurn(playerNumber) {
    var currentPlayerId = gameVars.gameStatus.turn,
    currentPlayerName = gameVars.playerInfo["Player" + currentPlayerId].name;

    gameVars.gameStatus.focus = "map";
    gameVars.gameStatus.mode = "attack";
    document.getElementById("map-message").innerHTML = currentPlayerName + " Choose Attack";
    document.getElementById("map-note").innerHTML = getMapNote();
    console.log("begin player " + playerNumber + " turn, focus = " + 
    gameVars.gameStatus.focus + ", mode = " + gameVars.gameStatus.mode);
}

function countPossibleAttacks() {
    var currentPlayerId = gameVars.gameStatus.turn,
    currentPlayerCountriesOnMap = [],
    currentPlayerBorders = [],
    enemyCountriesOnMap = [],
    possibleAttacks = [];

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        //add current player decks on map
        if (typeof gameVars.mapInfo.countryList[i].deck !== 'undefined' && 
        gameVars.mapInfo.countryList[i].deck.player === currentPlayerId) {
            currentPlayerCountriesOnMap.push(gameVars.mapInfo.countryList[i].country);
        }
        //add enemy decks on map
        if (typeof gameVars.mapInfo.countryList[i].deck !== 'undefined' && 
        gameVars.mapInfo.countryList[i].deck.player !== currentPlayerId) {
            enemyCountriesOnMap.push(gameVars.mapInfo.countryList[i].country);
        }
    }
    //list border countries
    for (var e = 0; e < currentPlayerCountriesOnMap.length; e++) {
        var currentCountryId = findCountryRef(currentPlayerCountriesOnMap[e]),
        currentCountry = gameVars.mapInfo.countryList[currentCountryId];
        
        for (var b = 0; b < currentCountry.borders.length; b++) {
            var currentBorder = currentCountry.borders[b];

            currentPlayerBorders.push(currentBorder);
        }
    }
    //unique border countries
    currentPlayerBorders = removeDuplicatesInArray(currentPlayerBorders);
    //add up possible attacks
    for (var p = 0; p < currentPlayerBorders.length; p++) {
        for (e = 0; e < enemyCountriesOnMap.length; e++) {
            if (currentPlayerBorders[p] === enemyCountriesOnMap[e]) {
                possibleAttacks.push(enemyCountriesOnMap[e]);
            }
        }
    }
    for (var q = 0; q < possibleAttacks.length; q++) {
        gameVars.battleScreenInfo.possibleAttacks.push(gameVars.mapInfo.countryList[findCountryRef(possibleAttacks[q])]);
    }
    for (var r = 0; r < currentPlayerCountriesOnMap.length; r++) {
        gameVars.battleScreenInfo.currentPlayerCountries.push(gameVars.mapInfo.countryList[findCountryRef(currentPlayerCountriesOnMap[r])]);
    }
    if (possibleAttacks.length === 0) {
        earthShakingEvent();
    }
    return possibleAttacks.length;
}

function earthShakingEvent() {
    console.log("Earth Shaking Event");
}




//map

function chooseAttackCountry(country) {
    var isAttackableRange = false,
    samePlayer = false,
    possibleAttacks = [],
    currentPlayer = gameVars.gameStatus.turn;

    clearAllMapBorders();
    if (gameVars.mapInfo.countryList[findCountryRef(country)].deck) {

        gameVars.mapInfo.mapSelect2 = gameVars.mapInfo.mapSelect1;
        gameVars.mapInfo.mapSelect1 = country;
        possibleAttacks = gameVars.mapInfo.countryList[findCountryRef(country)].borders;

        //checks for same player
        if (findCountryPlayer(country) === findCountryPlayer(gameVars.mapInfo.mapSelect2)) {
            samePlayer = true;
        }
        else {
            samePlayer = false;
        }

        //checks for attackable range
        for (var i = 0; i < possibleAttacks.length; i++) {
            if (possibleAttacks[i] === gameVars.mapInfo.mapSelect2) {
                isAttackableRange = true;
                break;
            }
            else {
                isAttackableRange = false;
            }
        }

        //action to take
        if (samePlayer === true) {
            //same player
            gameVars.mapInfo.mapSelect2 = "";
            gameVars.mapInfo.mapSelect1 = country;
            removeElement("map-message", "confirm-attack");
            updateMapNote(country);
        }
        else {
            if (isAttackableRange === true) {
                //attackable and in range
                updateMapNote(country + " vs " + gameVars.mapInfo.mapSelect2);
                addElement("map-message", "button", "Confirm Attack", "confirm-attack", 
                "noClass", confirmAttack);
            }
            else {
                //Out of range
                gameVars.mapInfo.mapSelect2 = "";
                gameVars.mapInfo.mapSelect1 = country;
                removeElement("map-message", "confirm-attack");
                updateMapNote(country);
            }
        }
    }
    else {
        gameVars.mapInfo.mapSelect2 = "";
        gameVars.mapInfo.mapSelect1 = "";
        updateMapNote(country);
    }
    //highlight enemies
    if (gameVars.mapInfo.mapSelect2 === "") {
        highlightEnemies(gameVars.mapInfo.countryList[findCountryRef(country)])
    }
}

function highlightEnemies(country) {
    var countryPlayer = country.deck.player,
    currentPlayer = gameVars.gameStatus.turn;

    //needs to highlight when previous country selected.





    

    for (var j = 0; j < country.borders.length; j++) {
        var currentBorderCountry = gameVars.mapInfo.countryList[findCountryRef(country.borders[j])];

        //if counrty player is not current player highlight borders that are current player
        if (countryPlayer !== currentPlayer) {
            if (!!currentBorderCountry.deck && currentBorderCountry.deck.player === currentPlayer) {  
                addClass(country.borders[j], "attack-threat");
            }        
        }

        //if coountry player is current player highlight all borders of other players
        else {
            if (!!currentBorderCountry.deck && currentBorderCountry.deck.player !== countryPlayer) {  
                addClass(country.borders[j], "attack-threat");
            }        
        }
    }
}

function clearAllMapBorders() {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        removeClass(gameVars.mapInfo.countryList[i].country, "attack-threat")
    }
}

function confirmAttack(confirmation) {
    console.log("confirm attack " + confirmation);
}

function updateMapNote(message) {
    document.getElementById("map-note").innerHTML = message;
}

function getMapNote() {
    var possibleAttacks = countPossibleAttacks();

    if (possibleAttacks === 1) {
        return "This is your last possible attack"
    }
    else {
        return "You have " + possibleAttacks + " possible attacks"
    }
}

function mapCountryClick(country) {
    switch (gameVars.gameStatus.mode) {
        case "placement": 
            placeCountry(country);
        break;
        case "attack":
            chooseAttackCountry(country);
        break;
        default: 
            console.log(country + " clicked for nothing");
    }
    refreshMapButtonColors();
}

function displayBattleInfo(battleDeckRef) {
    var currentPlayer = gameVars.battleScreenInfo.battleDecks[battleDeckRef].player,
    currentPlayerName = gameVars.playerInfo["Player" + currentPlayer].name,
    currentDeck = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deck.deckName,
    currentDeckColor = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deck.deckColor,
    r = gameVars.playerInfo["Player" + currentPlayer].playerColor[0],
    g = gameVars.playerInfo["Player" + currentPlayer].playerColor[1],
    b = gameVars.playerInfo["Player" + currentPlayer].playerColor[2],
    battleText = [
        currentPlayerName + " playing " + currentDeck + " (" + currentDeckColor + ")"
    ],
    gameMods = [
        countBattleLife(battleDeckRef),
        countBattleHand(battleDeckRef),
        countBattlePower(battleDeckRef),
        countBattleToughness(battleDeckRef),
        battleVanguard(battleDeckRef),
        battleDefensePlane(battleDeckRef),
        countCountrySupport(battleDeckRef),
        continentBonuses(battleDeckRef),
        battleHero(battleDeckRef),
        battleConspiracy(battleDeckRef),
        countBattleBonuses(battleDeckRef),
        countBattlePenalties(battleDeckRef)
    ];

    //add player and deck name (color)
    addElement("battle-information", "div",battleText, 
    "battle-player" + battleDeckRef, "battle-player");
    
    //create buttons
    addElement("battle-player" + battleDeckRef, "button", currentPlayerName, 
    "battle-winner-" + currentPlayer, "noClass", battleWinner);

    //color buttons
    setIDBackgroundColor("battle-winner-" + currentPlayer, r, g, b)
    setIdWithPlayerTextColor("battle-winner-" + currentPlayer, currentPlayer);

    //for each battle player show player, deck, life, cards
    for (var d = 0; d < gameMods.length; d++) {
        if (gameMods[d] !== "") {
            var gameModsCurrentText = gameMods[d][0] + gameMods[d][1]
            addElement("battle-player" + battleDeckRef, "div", gameModsCurrentText);
        }
    }
}

function BattleDeck(deck, player) {
    this.player = player;
    this.deck = deck;
}

function deckChooser(plyrNum) {
    if (gameVars.gameStatus.mode === "setup") {
        return gameVars.playerInfo["Player" + plyrNum].gameDeckRandomLibrary[0];
    }
    else {
        //add deck from map choice
        //find ground zero
        //tally all bonuses and penalties
    }
}

function setupBattleInfo() {
    var decksInGame = gameVars.battleScreenInfo.playersInBattleCount;

    for (var i = 0; i < decksInGame.length; i++) {
        var battleDeck = new BattleDeck(deckChooser(decksInGame[i]), decksInGame[i]);

        gameVars.battleScreenInfo.battleDecks.push(battleDeck);
    }
}

function openBattleScreen() { //from setup with screen cleared
    var battleParticipants = gameVars.battleScreenInfo.battleDecks;  
    setupBattleInfo();
    updateBattleLog("Initiation Battle Begins");
    for (var i = battleParticipants.length - 1; i >= 0; i--) {
        displayBattleInfo(i);
    }
}

//Battle winner Confirmed
function battleConfirmationText(namesOfWinners) {
    var confirmationText = [];

    for (var i = 0; i < namesOfWinners.length; i++) {
        var textToAdd = " " + namesOfWinners[i] + " is " + numberSuffix(i + 1);

        confirmationText.push(textToAdd);
    }
    return confirmationText;
}

function battleWinnerConfirmed() {
    var orderOfWinners = gameVars.battleScreenInfo.battleWinners,
    namesOfWinners = findPlayerNames(orderOfWinners),
    confirmationResults = battleConfirmationText(namesOfWinners),
    confirmationText = "The turn order will be:\n" + confirmationResults + "\nClick Ok to Accept";

    if (confirm (confirmationText)) {
        if (gameVars.gameStatus.mode === "setup") {

            setupBoard(confirmationResults, orderOfWinners);
        }
        else {
            //check for earthshaking event, or end of turn, go to map for next attack if not
            console.log("battle winner confirmed");
        }
        gameVars.gameStatus.focus = "map";
    }
}

function resetWinners() {
    removeElement("battle-note", "confirm-winners");
    removeElement("battle-note", "reset-winners");
    for (var i = 0; i < gameVars.battleScreenInfo.battleWinners.length; i++) {
        var playerIdToRename = gameVars.battleScreenInfo.battleWinners[i],
        playerNameToRename = gameVars.playerInfo["Player" + playerIdToRename].name,
        buttonToRename = document.getElementById("battle-winner-"+ playerIdToRename);

        buttonToRename.innerHTML = playerNameToRename;


    }
    for (var p = 1; p <= gameVars.battleScreenInfo.playersInBattleCount.length; p++) {
        undisableId("battle-winner-" + p);
    }
    gameVars.battleScreenInfo.battleWinners = [];
}

function showWinningButtonText(winningPlace, totalBattlePlayers) {
    if (totalBattlePlayers === winningPlace) {
        addElement("battle-note", "button", "Confirm Winners", "confirm-winners", "noClass", battleWinnerConfirmed);
        return "utterly defeated";
    }
    else {
        return numberSuffix(winningPlace) + " place";
    }
}

//Battle Winners Decided
function battleWinner(winningPlayerButton) {
    var playerId = winningPlayerButton.slice(14),
    winningPlayer = gameVars.playerInfo["Player" + playerId].name,
    winningPlayerCount = gameVars.battleScreenInfo.battleWinners.length,
    winningPlace = winningPlayerCount + 1,
    totalBattlePlayers = gameVars.battleScreenInfo.playersInBattleCount.length,
    winningButtonText = winningPlayer + " is " + showWinningButtonText(winningPlace, totalBattlePlayers);

    disableId(winningPlayerButton);
    gameVars.battleScreenInfo.battleWinners.push(playerId);
    winningPlayerCount = gameVars.battleScreenInfo.battleWinners.length
    document.getElementById(winningPlayerButton).innerHTML = winningButtonText;

    if (winningPlayerCount === 1) {
        addElement("battle-note", "button", "Reset Winners", "reset-winners", "noClass", resetWinners);
    }
}

//Initiation game begins
function startIniGame() {
    if (confirm ("Save player information and start initiation game?")) {
        startIniGameConfirmed();
    }  
}

//player setup begins
function beginPlayerSetup() {
    gameVars.globalGameOptions.totalPlayers = parseInt(document.getElementById("update-player-count").value);
    
    if (document.getElementById("shared-deck-pool").checked === true) {
        gameVars.globalGameOptions.sharedDeckPool = true
    } 
    else {
        gameVars.globalGameOptions.sharedDeckPool = false
    };

    if (document.getElementById("random-map-setup").checked === true) {
        gameVars.globalGameOptions.randomMapSetup = true
    } 
    else {
        gameVars.globalGameOptions.randomMapSetup = false
    };

    if (confirm("Are you sure you want these options for this game?\n Total Players: " + gameVars.globalGameOptions.totalPlayers + 
    "\n Shared Deck Pool: " + tfyn(gameVars.globalGameOptions.sharedDeckPool) + 
    "\n Random Map Setup: " + tfyn(gameVars.globalGameOptions.randomMapSetup))) {
        hideId("global-game-options");
        hideId("player-earned-info");
        unhideId("player-info");
        createPlayerOptions();
        refreshPlayerSetupInformation();
    } 
}

//setup begins
document.addEventListener("DOMContentLoaded", function() { 
    var maxPlayers = Object.keys(masterDeckList).length;

    addAuthorToDecklists(maxPlayers);

    hideId("player-info");
    hideId("battle-screen");
    hideId("map-screen");
    document.getElementById("update-player-count").max = maxPlayers;
    updateLog("Begin Setup");
});


