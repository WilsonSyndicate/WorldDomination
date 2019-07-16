


//Runtime


function prepDeckList() {
    var tempDeckList = gameVars.playerInfo.Player1.gameDeckLibrary,
    totalPlayers = Object.keys(gameVars.playerInfo).length,
    decksPerPlayer = Math.floor(tempDeckList.length / totalPlayers),
    normalizedDeckCount = lowestDeckCount(totalPlayers);

    if (gameVars.globalGameOptions.sharedDeckPool === true) {
        prepDeckListSharedPool(tempDeckList, totalPlayers, decksPerPlayer);
    }
    else {
        for (var p = 1; p <= totalPlayers; p++) {
            if (gameVars.normalizeDeckList === true) {
                prepDeckListNotSharedNormalizedPool(p, normalizedDeckCount);
            }
            else {
                prepDeckListNotSharedNotNormalizedPool(p);
            }
        }
    }
}



function setupPlayerName() {
    var currentPlayerName = gameVars.playerInfo["Player" + gameVars.playerScreenOptions.activeSetupPlayer].name,
    changePlayerNameTo = prompt("Change Name to:", currentPlayerName);

    if (changePlayerNameTo != null) {
        gameVars.playerInfo["Player" + gameVars.playerScreenOptions.activeSetupPlayer].name = changePlayerNameTo;
    }
    refreshNameShown(gameVars.playerScreenOptions.activeSetupPlayer);
}

function setupPlayerColor(color, value) {
    var currentPlayer = gameVars.playerScreenOptions.activeSetupPlayer
    gameVars.playerInfo["Player" + currentPlayer].playerColor[color] = value;

    refreshColorShown(currentPlayer);
}

function clearSetupDeckList() {
    var parentToClear = document.getElementById("library-table-container"),
    childToClear = document.getElementById("setup-player-decklist-table");

    if (typeof(childToClear) != 'undefined' && childToClear != null) {
        parentToClear.removeChild(childToClear);
    }
}

function setupPlayerChange() {
    var playerNum = document.getElementById("player-drop-select").value;

    gameVars.playerScreenOptions.activeSetupPlayer = playerNum;
    clearSetupDeckList()
    refreshPlayerSetupInformation();
}

function refreshNameShown(selectedPlayer) {
    var nameToShow = gameVars.playerInfo["Player" + selectedPlayer].name,
    placeToShow = document.getElementById("name-to-show");

    placeToShow.innerHTML = nameToShow;
    refreshDeckAuthor();   
    clearSetupDeckList();
    refreshDeckListShown(selectedPlayer);
}

function refreshColorSliders(r, g, b) {
    var redSlider = document.getElementById("red-value"),
    greenSlider = document.getElementById("green-value"),
    blueSlider = document.getElementById("blue-value");

    redSlider.value = r;
    greenSlider.value = g;
    blueSlider.value = b;
}

function refreshPlayerTextColor(selectedPlayer) {
    var playerTextColor = gameVars.playerInfo["Player" + selectedPlayer].textColor;

    document.getElementById("player-info").style.color = playerTextColor;
}

function refreshColorShown(selectedPlayer) {
    var r = gameVars.playerInfo["Player" + selectedPlayer].playerColor[0],
    g = gameVars.playerInfo["Player" + selectedPlayer].playerColor[1],
    b = gameVars.playerInfo["Player" + selectedPlayer].playerColor[2],
    colorToShow = 'rgb(' + [(r),(g),(b)].join(',') + ')';

    document.getElementById("player-info").style.backgroundColor = colorToShow;

    if (Math.max (r,g) < adminSettings.lightTextSetting) {
        gameVars.playerInfo["Player" + selectedPlayer].textColor = "white";
    }
    else {
        gameVars.playerInfo["Player" + selectedPlayer].textColor = "black";
    }

    refreshPlayerTextColor(selectedPlayer);
    refreshColorSliders(r, g, b);
}

function showDeckCount(selectedPlayer) {
    var deckCount = gameVars.playerInfo["Player" + selectedPlayer].gameDeckLibrary.length;

    document.getElementById("player-decklist-count").innerHTML = "Library Count: " + deckCount;
}

function refreshDeckListShown(selectedPlayer) {
    var totalDecks = gameVars.playerInfo["Player" + selectedPlayer].gameDeckLibrary.length,
    tableBody = document.getElementById("library-table-container"), //reference for body
    tbl = document.createElement("table"), //table element
    tblBody = document.createElement("tbody"), //tbody element)
    tblHeader = document.createElement("thead");

    var tblHeaderValues = ["Name", "Color", "Format", "Cards", "Rank", "Notes"],
    tblHeaderRow = document.createElement("tr");

    if (gameVars.globalGameOptions.sharedDeckPool === true) {
        tblHeaderValues.push("Author");
    }

    tblHeader.appendChild(tblHeaderRow);
    for (var h = 0; h < tblHeaderValues.length; h++) {
        var headerValue = tblHeaderValues[h],
        headerCell = document.createElement("th"),
        headerText = document.createTextNode(headerValue);
       
        headerCell.appendChild(headerText);
        tblHeaderRow.appendChild(headerCell);
    }

    for (var i = 0; i < totalDecks; i++) { //creates all cells
        var row = document.createElement("tr"); //creates a table row

        for (var j = 0; j < tblHeaderValues.length; j++) { //create a td element and text node, make the text node the contents of td and put td at the end of table row
            var currentDeck = gameVars.playerInfo["Player" + selectedPlayer].gameDeckLibrary[i],
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

function refreshPlayerSetupInformation() {
    var selectedPlayer = gameVars.playerScreenOptions.activeSetupPlayer;

    refreshNameShown(selectedPlayer);
    refreshColorShown(selectedPlayer);
    showDeckCount(selectedPlayer);
}

function refreshDeckAuthor() {
    //for each player, each deck in library, change deckauthorname to name of deckauthor

    for (var p = 1; p <= gameVars.globalGameOptions.totalPlayers; p++) {
        var currentLibrary = gameVars.playerInfo["Player" + p].gameDeckLibrary

        for (var d = 0; d < currentLibrary.length; d++) {
            var currentDeckAuthorNumber = gameVars.playerInfo["Player" + p].gameDeckLibrary[d].deckAuthor,
            currentDeckAuthorName = gameVars.playerInfo["Player" + currentDeckAuthorNumber].name;

            currentLibrary[d].deckAuthorName = currentDeckAuthorName;
        }
    }


    
   

}

function addAuthorToDecklists(maxPlayers) {
    for (var p = 1; p <= maxPlayers; p++) {

        for (var d = 0; d < masterDeckList["deckListPlayer" + p].length; d++) {
           masterDeckList["deckListPlayer" + p][d].deckAuthorName = "Player" + p;
           masterDeckList["deckListPlayer" + p][d].deckAuthor = p;
        }
    }
}

function loadDeckLists(playerNum) {
    if (gameVars.globalGameOptions.sharedDeckPool === true) {
        var decksToAdd = [];
        
        for (var p = 1; p <= gameVars.globalGameOptions.totalPlayers; p++) {
            decksToAdd = decksToAdd.concat(masterDeckList["deckListPlayer" + p]);
        }
        gameVars.playerInfo['Player' + playerNum].gameDeckLibrary = decksToAdd;
    }
    else {
        var listToUse = masterDeckList["deckListPlayer" + playerNum];

        gameVars.playerInfo['Player' + playerNum].gameDeckLibrary = listToUse;
    }

    gameVars.playerInfo["Player" + playerNum].gameDeckLibrary.sort(function(a, b) {
        if (a.deckName.toUpperCase() < b.deckName.toUpperCase()) { return -1; }
        if (a.deckName.toUpperCase() > b.deckName.toUpperCase()) { return 1;}
    })
}

function createPlayerInfo (plNum) {
    gameVars.playerInfo["Player" + plNum] = {
        name: "Player" + plNum,
        player: plNum,
        playerColor: [255,255,255],
        textColor: "black",
        gameDeckLibrary: [],
        gameDeckRandomLibrary: [],
        continentsControlled: [],
        continentsOwned: []
    };
    gameVars.battleScreenInfo.playersInBattleCount.push(plNum);
}

function createPlayerOptions() {
    var playerSelect = document.createElement("select");
    var container = document.getElementById("player-dropdown-select-container")

    for (var i = 1; i <= gameVars.globalGameOptions.totalPlayers; i++) {
        var option = document.createElement("option");  //Uses the option as a container for created elements

        option.innerHTML = i; //makes an option for each player
        playerSelect.appendChild(option); //appends each option to the variable outside the loop

        option.value = i;
        createPlayerInfo(i);
        loadDeckLists(i);  
    };
    playerSelect.id = "player-drop-select";
    container.appendChild(playerSelect); //appends the container list to the DOM
}




//Game Engine

function startIniGameConfirmed() {
    prepDeckList();
    hideId("player-info");
    unhideId("battle-screen");
    openBattleScreen();
}

function lowestDeckCount(totalPlayers) {
    var updatedDeckCount = [];

    for (var p = 1; p <= totalPlayers; p++) {
        updatedDeckCount.push(gameVars.playerInfo["Player" + p].gameDeckLibrary.length);
    }
    return findLowest(updatedDeckCount);
}

function prepDeckListSharedPool(tempDeckList, totalPlayers, decksPerPlayer) {
    shuffleArray(tempDeckList);

    for (var p = 1; p <= totalPlayers; p++) {
        gameVars.playerInfo["Player" + p].gameDeckLibrary = [];
        gameVars.playerInfo["Player" + p].gameDeckLibrary = tempDeckList.splice(0, decksPerPlayer);
        gameVars.playerInfo["Player" + p].gameDeckRandomLibrary = gameVars.playerInfo["Player" + p].gameDeckLibrary.slice();
        alphaOrderDeckName(gameVars.playerInfo["Player" + p].gameDeckLibrary);
    }
}

function prepDeckListNotSharedNormalizedPool(playerNumber, normalizedDeckCount) {
    shuffleArray(playerInfo["Player" + playerNumber].gameDeckLibrary);
    playerInfo["Player" + playerNumber].gameDeckRandomLibrary = 
    playerInfo["Player" + playerNumber].gameDeckLibrary.slice(0, normalizedDeckCount);
    playerInfo["Player" + playerNumber].gameDeckLibrary = 
    playerInfo["Player" + playerNumber].gameDeckRandomLibrary.slice();
    alphaOrderDeckName(playerInfo["Player" + playerNumber].gameDeckLibrary);
}

function prepDeckListNotSharedNotNormalizedPool(playerNumber) {
    gameVars.playerInfo["Player" + playerNumber].gameDeckRandomLibrary = gameVars.playerInfo["Player" + playerNumber].gameDeckLibrary.slice();
    shuffleArray(gameVars.playerInfo["Player" + playerNumber].gameDeckRandomLibrary);
}


//Task Masters

function findLowest(arrayToCheck) {
    var lowest = arrayToCheck[0];

    for (var i = 0; i < arrayToCheck.length; i++) {
        if (arrayToCheck[i] < lowest) {
            lowest = arrayToCheck[i];
        }
    }
    return lowest;
}

function alphaOrderDeckName(deckListToOrder) {
    deckListToOrder.sort(function(a, b) {
        if (a.deckName.toUpperCase() < b.deckName.toUpperCase()) { return -1;}
        if (a.deckName.toUpperCase() > b.deckName.toUpperCase()) { return 1;}
    })
}

function shuffleArray(arrayToShuffle) {
    for (var i = arrayToShuffle.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arrayToShuffle[i];
        arrayToShuffle[i] = arrayToShuffle[j];
        arrayToShuffle[j] = temp;
    }
}

function tfyn(tf) {
    if (tf === true) {
        return "Yes";
    }
    else {
        return "No";
    }
}

function updateLog(text) {
    gameVars.gameLog.unshift(Date() + " " + text);
}

function unhideId(elem) {
    document.getElementById(elem).classList.remove('hide-item-class');
}

function hideId(elem) {
    document.getElementById(elem).classList.add('hide-item-class');
}

