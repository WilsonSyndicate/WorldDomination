//Player Setup

function findIntroLogText(currentLogEntry) {
    if (currentLogEntry[1].search("Begins") !== -1) {
        if (currentLogEntry[1].search("Initiation") !== -1) {
            return currentLogEntry[1];
        }
        else {
            var attackLogName = findPlayerName(currentLogEntry[2]),
            attackLogDeckName = currentLogEntry[3][0].deckName;

            return attackLogName + " attacks with " + attackLogDeckName;
        }
    }
    else if (currentLogEntry[1].search("Complete") !== -1) {

        if (currentLogEntry[1].search("Initiation") !== -1) {
            var completedLogName = findPlayerName(currentLogEntry[2][0][0]),
            completedLogEntry = currentLogEntry[2][0][1];

            return completedLogName + " playing " + completedLogEntry + " wins the Initiation Game!";
        }
        else {
            return currentLogEntry[2][0]
        }
    }
    else if (currentLogEntry[1].search("Drop") !== -1) {
        return "Supply Drop";
    }
}

function showLogInfo() {
    if (gameVars.gameLog.length > 0) {
        var logTextToShow = [];

        for (var i = 0; i < gameVars.gameLog.length; i++) {
            logTextToShow.push({
                logEntry: stringToDate(gameVars.gameLog[i][0])[1] + " " + stringToDate(gameVars.gameLog[i][0])[2] + ", " + stringToDate(gameVars.gameLog[i][0])[3],
                logText: findIntroLogText(gameVars.gameLog[i])
            });
        }


        //create table with above info
        var tableBody = document.getElementById("log-information"), //reference for body
        tbl = document.createElement("table"), //table element
        tblBody = document.createElement("tbody"), //tbody element)
        tblHeader = document.createElement("thead");

        var tblHeaderValues = ["Date", "Log"],
        tblHeaderRow = document.createElement("tr");

        //remove previous list
        removeElement("log-information", "log-info");
        tblHeader.appendChild(tblHeaderRow);
        for (var h = 0; h < tblHeaderValues.length; h++) {
            var headerValue = tblHeaderValues[h],
            headerCell = document.createElement("th"),
            headerText = document.createTextNode(headerValue);
            headerCell.appendChild(headerText);
            tblHeaderRow.appendChild(headerCell);
        }

        //creates all cells
        for (var i = 0; i < logTextToShow.length; i++) { 
            
            //creates a table row
            var row = document.createElement("tr"); 

            //create a td element and text node, make the text node the contents of td and put td at the end of table row
            for (var j = 0; j < tblHeaderValues.length; j++) { 
                var currentCountry = logTextToShow[i],
                values = Object.values(currentCountry),
                cell = document.createElement("td"),
                cellText = document.createTextNode(values[j]);

                cell.appendChild(cellText);    
                row.appendChild(cell);        
            }
            tblBody.appendChild(row);
        }
        tbl.id = "log-info";
        tbl.appendChild(tblHeader);
        tbl.appendChild(tblBody);
        tableBody.appendChild(tbl);
        //add class for bootstrap
        document.getElementById("log-info").classList.add("table-striped");











    }
}

function introScreenName(currentCountry) {
    if (!!currentCountry.deck) {
        var currentDeck = findFullDeckWithPlayerAndName(currentCountry.deck.deckPlayer, currentCountry.deck.deckName),
        playerName = findPlayerName(findCountryPlayer(currentCountry.country));
        
        if (currentDeck.deckHidden) return playerName;
        return playerName + " playing " + currentCountry.deck.deckName;
    }
    return "-Empty-";
}
function introScreenColor(currentCountry) {
    if (!!currentCountry.deck) {
        var currentDeck = findFullDeckWithPlayerAndName(currentCountry.deck.deckPlayer, currentCountry.deck.deckName);

        if (currentDeck.deckHidden) return "";
        return "(" + currentDeck.deckColors + ")";
    }
    return "";
}
function introScreenGames(currentCountry) {
    if (!!currentCountry.deck) {
        var currentDeck = findFullDeckWithPlayerAndName(currentCountry.deck.deckPlayer, currentCountry.deck.deckName);
        
        if (currentDeck.deckGamesPlayed === 0) return "";
        return currentDeck.deckGamesPlayed;
    }
    return "";
}
function introScreenBonus(currentCountry) {
    if (!!currentCountry.deck) {
        var currentDeck = findFullDeckWithPlayerAndName(currentCountry.deck.deckPlayer, currentCountry.deck.deckName);
        
        if (currentDeck.deckBonuses === 0) return "";
        return currentDeck.deckBonuses;
    }
    return "";
}
function introScreenPenalty(currentCountry) {
    if (!!currentCountry.deck) {
        var currentDeck = findFullDeckWithPlayerAndName(currentCountry.deck.deckPlayer, currentCountry.deck.deckName);
        
        if (currentDeck.deckPenalties === 0) return "";
        return currentDeck.deckPenalties;
    }
    return "";
}

function updateIntroScreen() {
    //show country list with player, deck, bonuses and penalties
    var countryList = [];

    for (var c = 0; c < gameVars.mapInfo.countryList.length; c++) {
        countryList.push({
            countryName: gameVars.mapInfo.countryList[c].countryName, 
            deckName: introScreenName(gameVars.mapInfo.countryList[c]),
            deckColor: introScreenColor(gameVars.mapInfo.countryList[c]),
            deckGames: introScreenGames(gameVars.mapInfo.countryList[c]),
            deckBonuses: introScreenBonus(gameVars.mapInfo.countryList[c]),
            deckPenalties: introScreenPenalty(gameVars.mapInfo.countryList[c])
        }); 
    }
    //future version 
    //add defense plane, hero, conspiracy, etc

    //create table with above info
    var tableBody = document.getElementById("intro-information"), //reference for body
    tbl = document.createElement("table"), //table element
    tblBody = document.createElement("tbody"), //tbody element)
    tblHeader = document.createElement("thead");

    var tblHeaderValues = ["Country", "Deck", "Color", "Games", "Bonuses", "Penalties"],
    tblHeaderRow = document.createElement("tr");

    //remove previous list
    removeElement("intro-information", "known-info");
    tblHeader.appendChild(tblHeaderRow);
    for (var h = 0; h < tblHeaderValues.length; h++) {
        var headerValue = tblHeaderValues[h],
        headerCell = document.createElement("th"),
        headerText = document.createTextNode(headerValue);
        headerCell.appendChild(headerText);
        tblHeaderRow.appendChild(headerCell);
    }

    //creates all cells
    for (var i = 0; i < countryList.length; i++) { 
        
        //creates a table row
        var row = document.createElement("tr"); 

        //create a td element and text node, make the text node the contents of td and put td at the end of table row
        for (var j = 0; j < tblHeaderValues.length; j++) { 
            var currentCountry = countryList[i],
            values = Object.values(currentCountry),
            cell = document.createElement("td"),
            cellText = document.createTextNode(values[j]);

            cell.appendChild(cellText);    
            row.appendChild(cell);        
        }
        tblBody.appendChild(row);
    }
    tbl.id = "known-info";
    tbl.appendChild(tblHeader);
    tbl.appendChild(tblBody);
    tableBody.appendChild(tbl);
    //add class for bootstrap
    document.getElementById("known-info").classList.add("table-hover");
    //display log information
    showLogInfo();
}

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
    battleDecks = [],
    randomSetup = true;//change when placement setup enabled on future version

    //log end of game, add winner decks in order
    for (var i = 0; i < gameVars.battleScreenInfo.battleWinner.length; i++) {
        var currentBattlePlayer = gameVars.battleScreenInfo.battleWinner[i],
        currentBattleDeck = findBattleDeckNameWithPlayer(currentBattlePlayer);

        battleDecks.push([currentBattlePlayer, currentBattleDeck]);
    }
    logText.push(battleDecks);
    updateLog(logText)
    //update turn order
    gameVars.gameStatus.turnOrder = gameVars.battleScreenInfo.battleWinner;
    //update turn
    gameVars.gameStatus.turn = gameVars.battleScreenInfo.battleWinner[0];
    //update tool bar color
    updateToolbarColors(gameVars.gameStatus.turn);
    //cleanup decklists
    cleanupPlayerDeckLists();

    //future version
    //setup hero

    //future version
    //setup conspiracy

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
        //show battle info
        showBattle();
        //load initiation decks as battle decks
        for (var i = 1; i <= gameVars.globalGameOptions.totalPlayers; i++) {
            var currentPlayer = i,
            currentIniDeck = gameVars.playerInfo["player" + i].playerDecklist[0];

            gameVars.playerInfo["player" + i].playerDecklist[0].deckHidden = false;
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
    //add class for bootstrap
    document.getElementById("setup-player-decklist-table").classList.add("table-striped");
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
        removeClass("setup-toolbar", "player-color-" + i);
    }
    addClass("setup-toolbar", "player-color-" + currentPlayerNumber);
    //change name change button color
    removeAllNameChangeButtonPlayerColors();
    document.getElementById("button-change-name").classList.add("player-color-" + document.getElementById("update-setup-player").value);
    //shuffledecklists
    shuffleAllDecklists();
}

function removeAllNameChangeButtonPlayerColors() {
    for (var i = 1; i <= gameVars.globalGameOptions.totalPlayers; i++) {
        removeClass("button-change-name", "player-color-" + i);
    }
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