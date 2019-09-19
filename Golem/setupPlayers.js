//Player Setup

function cleanupPlayerDeckLists() {
    for (var i = 0; i < gameVars.gameStatus.turnOrder.length; i++) {
        var currentPlayer = gameVars.gameStatus.turnOrder[i]
        currentPlayerDecklist = gameVars.playerInfo["player" + currentPlayer].playerDecklist;

        for (var d = 0; d < currentPlayerDecklist.length; d++) {
            currentPlayerDecklist[d].deckHidden = true;
            currentPlayerDecklist[d].deckEliminated = false;
            currentPlayerDecklist[d].deckDefensePlane = "";
            currentPlayerDecklist[d].deckPenalties = 0;
            currentPlayerDecklist[d].deckBonuses = 0;
            currentPlayerDecklist[d].deckVanguards = [];
            currentPlayerDecklist[d].deckAttacksMade = 0;
            currentPlayerDecklist[d].deckTimesDefended = 0;
            currentPlayerDecklist[d].deckTimesJoined = 0;          
            currentPlayerDecklist[d].deckGamesPlayed = 0;
            currentPlayerDecklist[d].deckWins = 0;
            currentPlayerDecklist[d].deckUniqueId = {deckPlayer: currentPlayer, deckName: currentPlayerDecklist[d].deckName};
        }
    }
}

function buildSupplyPointList() {
    var supplyPointTypes = gameVars.globalGameOptions.supplyInfo.numberOfSupplyPointTypes,
    randomSupplyPoints = gameVars.globalGameOptions.supplyInfo.numberOfRandomSupplyPoints,
    randomCountryList = [],
    supplyPointList = [],
    currentSupplyType = 0;

    //create random country list
    for (var c = 0; c < gameVars.mapInfo.countryList.length; c++) {
        randomCountryList.push(gameVars.mapInfo.countryList[c].country);
    }
    shuffleArray(randomCountryList);

    //country supply points
    for (var i = 0; i < randomCountryList.length; i++) {
        currentSupplyType += 1;
        supplyPointList.push({"supplyType": currentSupplyType, "supplyCountry": randomCountryList[i]});

        if (currentSupplyType === supplyPointTypes) {
            currentSupplyType = 0;
        }
    }
    //random supply points
    for (var r = 0; r < randomSupplyPoints; r++) {
        supplyPointList.push({"supplyType": "wild", "supplyCountry": "none"});
    }
    gameVars.globalGameOptions.supplyInfo.supplyDropCardsToDraw = supplyPointList;
    shuffleArray(gameVars.globalGameOptions.supplyInfo.supplyDropCardsToDraw);
}

function topOfPlacementSetup() {
    //clear all battle buttons and battle variables
    battleScreenCleanup();

    showMap();

    //future version - placement setup
    //starting with ref 1, add decks in turn order until all decks are set.
    //once setup is complete, go to top of turn
}

function setupComplete() {
    var logText = ["Initiation Game Complete"],
    randomSetup = true;//change when placement setup enabled

    //log end of game, add winner decks in order
    for (var i = 0; i < gameVars.battleScreenInfo.battleWinner.length; i++) {
        var currentBattlePlayer = gameVars.battleScreenInfo.battleWinner[i],
        currentBattleDeck = findBattleDeckNameWithPlayer(currentBattlePlayer);

        logText.push([currentBattlePlayer, currentBattleDeck]);
    }
    updateLog(logText)

    //update turn order
    gameVars.gameStatus.turnOrder = gameVars.battleScreenInfo.battleWinner;

    //update turn
    gameVars.gameStatus.turn = gameVars.battleScreenInfo.battleWinner[0];
    
    //cleanup decklists
    cleanupPlayerDeckLists();

    if (randomSetup) {
        //set up map
        setupMapInformation();

        //top of turn
        topOfTurn();
    }
    else {
        //top of placement setup
        topOfPlacementSetup()
    }

    //build supply point list
    buildSupplyPointList();
}

function toIniGame() {
    var toIniGame = confirm("Save this information and proceed to Initiation Game?");

    if (toIniGame === true) {

        //shuffledecklists
        shuffleAllDecklists();

        showBattle();

        //load initiation decks as battle decks
        for (var i = 1; i <= gameVars.globalGameOptions.totalPlayers; i++) {
            var currentPlayer = i,
            currentIniDeck = gameVars.playerInfo["player" + i].playerDecklist[0];

            gameVars.battleScreenInfo.battleDecks.push({deckPlayer: currentPlayer, deckName: currentIniDeck.deckName});
        }

        //update battle players count
        gameVars.battleScreenInfo.battlePlayersCount = gameVars.battleScreenInfo.battleDecks.length;

        //show battle screen info for initiation
        for (var j = 0; j < gameVars.battleScreenInfo.battlePlayersCount; j++) {
            displayBattleInfo(j);
        }

        //log beginning of initiation game
        updateLog(["Initiation Game Begins"]);
    }
}

function refreshDeckListShown(decklistCount, deckList) {
    var tableBody = document.getElementById("decklist-container"), //reference for body
    tbl = document.createElement("table"), //table element
    tblBody = document.createElement("tbody"), //tbody element)
    tblHeader = document.createElement("thead");

    var tblHeaderValues = ["Name", "Color"],
    tblHeaderRow = document.createElement("tr");
    
    //remove previous list
    removeElement("decklist-container", "setup-player-decklist-table");

    tblHeader.appendChild(tblHeaderRow);
    for (var h = 0; h < tblHeaderValues.length; h++) {
        var headerValue = tblHeaderValues[h],
        headerCell = document.createElement("th"),
        headerText = document.createTextNode(headerValue);
       
        headerCell.appendChild(headerText);
        tblHeaderRow.appendChild(headerCell);
    }

    //creates all cells
    for (var i = 0; i < decklistCount; i++) { 
        
        //creates a table row
        var row = document.createElement("tr"); 

        //create a td element and text node, make the text node the contents of td and put td at the end of table row
        for (var j = 0; j < tblHeaderValues.length; j++) { 
            var currentDeck = deckList[i],
            values = Object.values(currentDeck),
            cell = document.createElement("td"),
            cellText = document.createTextNode(values[j]);

            cell.appendChild(cellText);    
            row.appendChild(cell);        
        }
        tblBody.appendChild(row);
    }
    tbl.id = "setup-player-decklist-table";
    tbl.appendChild(tblHeader);
    tbl.appendChild(tblBody);
    tableBody.appendChild(tbl);
}

function shuffleAllDecklists() {
    for (var i = 1; i < 6; i++) {
        shuffleArray(gameVars.playerInfo["player" + i].playerDecklist);
    }
}

function countPlayerDecklist(playerNumber) {
    return gameVars.playerInfo["player" + playerNumber].playerDecklist.length;
}

function changeCurrentSetupPlayer() {
    var currentPlayerNumber = Number(document.getElementById("update-setup-player").value),
    currentPlayerName = gameVars.playerInfo["player" + currentPlayerNumber].playerName,
    decklistToShow = gameVars.playerInfo["player" + currentPlayerNumber].playerDecklist.concat(),
    decklistCount = countPlayerDecklist(currentPlayerNumber);

    //show current player name
    updateDOMElement("display-name", currentPlayerName);

    //show current player deck count
    document.getElementById("potential-decklist").innerHTML = "Potential Decklist (" + decklistCount + ")";

    //show current player decklist
    orderArray(decklistToShow, "deckName");
    refreshDeckListShown(decklistCount, decklistToShow);

    //update background
    for (var i = 1; i < 6; i++) {
        removeClass("pre-game-screen", "player-color-" + i);
    }
    addClass("pre-game-screen", "player-color-" + currentPlayerNumber);
    
    //shuffledecklists
    shuffleAllDecklists();
}

function changeNumberOfPlayers() {
    var newNumberOfPlayers = Number(document.getElementById("update-player-count").value);

    //update variable
    gameVars.globalGameOptions.totalPlayers = newNumberOfPlayers;

    //set max player number
    document.getElementById("update-setup-player").max = newNumberOfPlayers;

    //turn to max if past
    if (document.getElementById("update-setup-player").value > newNumberOfPlayers) {
        document.getElementById("update-setup-player").value = newNumberOfPlayers;
        changeCurrentSetupPlayer();
    }
    
    //shuffledecklists
    shuffleAllDecklists();
}

function setupPlayerName() {
    var currentPlayerNumber = Number(document.getElementById("update-setup-player").value),
    currentPlayerName = gameVars.playerInfo["player" + currentPlayerNumber].playerName,
    changePlayerNameTo = prompt("Change Name to:", currentPlayerName);

    if (!!changePlayerNameTo) {
        gameVars.playerInfo["player" + currentPlayerNumber].playerName = changePlayerNameTo;
    }
    updateDOMElement("display-name", changePlayerNameTo);

    //shuffledecklists
    shuffleAllDecklists();
}

function initialStartup() {
    showIntro();

    //refresh player 1 info
    changeCurrentSetupPlayer();
}