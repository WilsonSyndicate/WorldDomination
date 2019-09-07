//Player Setup


function setupComplete() {
    var logText = [];
    
    console.log("go to map and set up board");
    console.log(gameVars.battleScreenInfo.battleWinners);

    //log end of game, add winner decks in order
    //push note, then push winners
    updateLog(logText)

    //update turn order
    gameVars.gameStatus.turnOrder = gameVars.battleScreenInfo.battleWinners;

    //update turn
    gameVars.gameStatus.turn = gameVars.battleScreenInfo.battleWinners[0];
    
    //add deck info to decklists (bonus,penalties,etc)


    //change mode
    gameVars.gameStatus.focus = "attack";

    //change focus
    gameVars.gameStatus.focus = "map";

    //clear all battle buttons and battle variables
    //battleScreenCleanup(orderOfWinners.length);

    //hide battle screen
    hideId("battle-screen");

    //go to map
    unhideId("map-screen");

    //set up board
    //setupBoard(confirmationResults, orderOfWinners);
}









function toIniGame() {
    var toIniGame = confirm("Save this information and proceed to Initiation Game?");

    if (toIniGame === true) {

        //shuffledecklists
        shuffleAllDecklists();

        //hide pre game screen
        hideId("pre-game-screen");

        //show battle screen
        unhideId("battle-screen");

        //update focus to battle
        gameVars.gameStatus.focus = "battle";

        //load initiation decks as battle decks
        for (var i = 1; i <= gameVars.globalGameOptions.totalPlayers; i++) {
            var currentPlayer = i,
            currentIniDeck = gameVars.playerInfo["player" + i].playerDecklist[0];

            gameVars.battleScreenInfo.battleDecks.push([currentPlayer, currentIniDeck]);
        }

        //update battle players count
        gameVars.battleScreenInfo.playersInBattleCount = gameVars.battleScreenInfo.battleDecks.length;

        //show battle screen info for initiation
        for (var j = 0; j < gameVars.battleScreenInfo.playersInBattleCount; j++) {
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
    console.log("decks shuffled")
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
    //hide game screens
    hideId("battle-screen");
    hideId("map-screen");

    //refresh player 1 info
    changeCurrentSetupPlayer();
}