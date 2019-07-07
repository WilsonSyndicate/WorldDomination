


//Runtime


function prepDeckList() {
    var tempDeckList = playerInfo.Player1.gameDeckLibrary,
    totalPlayers = Object.keys(playerInfo).length,
    decksPerPlayer = Math.floor(tempDeckList.length / totalPlayers),
    normalizedDeckCount = lowestDeckCount(totalPlayers);

    if (globalGameOptions.sharedDeckPool === true) {
        prepDeckListSharedPool(tempDeckList, totalPlayers, decksPerPlayer);
    }
    else {
        for (var p = 1; p <= totalPlayers; p++) {
            if (normalizeDeckList === true) {
                prepDeckListNotSharedNormalizedPool(p, normalizedDeckCount);
            }
            else {
                prepDeckListNotSharedNotNormalizedPool(p);
            }
        }
    }
}

function startIniGame() {
    if (confirm ("Save player infomration and start initiation game?")) {
        startIniGameConfirmed();
    }  
}

function setupPlayerName() {
    var currentPlayerName = playerInfo["Player" + playerScreenOptions.activeSetupPlayer].name,
    changePlayerNameTo = prompt("Change Name to:", currentPlayerName);

    if (changePlayerNameTo != null) {
        playerInfo["Player" + playerScreenOptions.activeSetupPlayer].name = changePlayerNameTo;
    }
    refreshNameShown(playerScreenOptions.activeSetupPlayer);
}

function setupPlayerColor(color, value) {
    var currentPlayer = playerScreenOptions.activeSetupPlayer
    playerInfo["Player" + currentPlayer].playerColor[color] = value;

    refreshColorShown(currentPlayer);
}

function clearSetupDeckList() {
    var parentToClear = document.getElementById("library-table-container"),
    childToClear = document.getElementById("setup-player-decklist-table");

    parentToClear.removeChild(childToClear);
}

function setupPlayerChange() {
    var playerNum = document.getElementById("player-drop-select").value;

    playerScreenOptions.activeSetupPlayer = playerNum;
    clearSetupDeckList()
    refreshPlayerSetupInformation();
}

function refreshNameShown(selectedPlayer) {
    var nameToShow = playerInfo["Player" + selectedPlayer].name,
    placeToShow = document.getElementById("name-to-show");

    placeToShow.innerHTML = nameToShow;
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
    var playerTextColor = playerInfo["Player" + selectedPlayer].textColor;

    document.getElementById("player-info").style.color = playerTextColor;
}

function refreshColorShown(selectedPlayer) {
    var r = playerInfo["Player" + selectedPlayer].playerColor[0],
    g = playerInfo["Player" + selectedPlayer].playerColor[1],
    b = playerInfo["Player" + selectedPlayer].playerColor[2],
    colorToShow = 'rgb(' + [(r),(g),(b)].join(',') + ')';

    document.getElementById("player-info").style.backgroundColor = colorToShow;

    if (Math.max (r,g) < lightTextSetting) {
        playerInfo["Player" + selectedPlayer].textColor = "white";
    }
    else {
        playerInfo["Player" + selectedPlayer].textColor = "black";
    }

    refreshPlayerTextColor(selectedPlayer);
    refreshColorSliders(r, g, b);
}

function showDeckCount(selectedPlayer) {
    var deckCount = playerInfo["Player" + selectedPlayer].gameDeckLibrary.length;

    document.getElementById("player-decklist-count").innerHTML = "Library Count: " + deckCount;
}

function refreshDeckListShown(selectedPlayer) {
    var totalDecks = playerInfo["Player" + selectedPlayer].gameDeckLibrary.length,
    tableBody = document.getElementById("library-table-container"), //reference for body
    tbl = document.createElement("table"), //table element
    tblBody = document.createElement("tbody"), //tbody element)
    tblHeader = document.createElement("thead");

    var tblHeaderValues = ["Name", "Color", "Format", "Cards", "Rank", "Notes"],
    tblHeaderRow = document.createElement("tr");

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
            var currentDeck = playerInfo["Player" + selectedPlayer].gameDeckLibrary[i],
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
    var selectedPlayer = playerScreenOptions.activeSetupPlayer;

    refreshNameShown(selectedPlayer);
    refreshColorShown(selectedPlayer);
    showDeckCount(selectedPlayer);
    refreshDeckListShown(selectedPlayer);
}

function loadDeckLists(playerNum) {
    if (globalGameOptions.sharedDeckPool === true) {
        var decksToAdd = [];
        
        for (var p = 1; p <= globalGameOptions.totalPlayers; p++) {
            decksToAdd = decksToAdd.concat(masterDeckList["deckListPlayer" + p]);
        }
        playerInfo['Player' + playerNum].gameDeckLibrary = decksToAdd;
    }
    else {
        var listToUse = masterDeckList["deckListPlayer" + playerNum];

        playerInfo['Player' + playerNum].gameDeckLibrary = listToUse;
    }

    playerInfo["Player" + playerNum].gameDeckLibrary.sort(function(a, b) {
        if (a.deckName.toUpperCase() < b.deckName.toUpperCase()) { return -1; }
        if (a.deckName.toUpperCase() > b.deckName.toUpperCase()) { return 1;}
    })
}

function createPlayerInfo (plNum) {
    playerInfo["Player" + plNum] = {
        name: "Player" + plNum,
        player: plNum,
        playerColor: [255,255,255],
        textColor: "black",
        gameDeckLibrary: [],
        gameDeckRandomLibrary: [],
        continentsControlled: [],
        continentsOwned: []
    };
    battleScreenInfo.playersInBattle.push(plNum);
}

function createPlayerOptions() {
    var playerSelect = document.createElement("select");
    var container = document.getElementById("player-dropdown-select-container")

    for (var i = 1; i <= globalGameOptions.totalPlayers; i++) {
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

function beginPlayerSetup() {
    globalGameOptions.totalPlayers = document.getElementById("update-player-count").value
    
    if (document.getElementById("shared-deck-pool").checked === true) {
        globalGameOptions.sharedDeckPool = true
    } 
    else {
        globalGameOptions.sharedDeckPool = false
    };

    if (document.getElementById("random-map-setup").checked === true) {
        globalGameOptions.randomMapSetup = true
    } 
    else {
        globalGameOptions.randomMapSetup = false
    };

    if (confirm("Are you sure you want these options for this game?\n Total Players: " + globalGameOptions.totalPlayers + 
    "\n Shared Deck Pool: " + tfyn(globalGameOptions.sharedDeckPool) + 
    "\n Random Map Setup: " + tfyn(globalGameOptions.randomMapSetup))) {
        hideId("global-game-options");
        hideId("player-earned-info");
        unhideId("player-info");
        createPlayerOptions();
        refreshPlayerSetupInformation();
    } 
}

function beginSetup() {
    var maxPlayers = Object.keys(masterDeckList).length;

    hideId("player-info");
    hideId("battle-screen");
    document.getElementById("update-player-count").max = maxPlayers;
    updateLog("Begin Setup");
}

document.addEventListener("DOMContentLoaded", function() {
    beginSetup();
});

//Game Engine

function startIniGameConfirmed() {
    prepDeckList()
    updateLog("Initiative Game Begins");
    openBattleScreen();
    hideId("player-info");
    unhideId("battle-screen");
}

function lowestDeckCount(totalPlayers) {
    var updatedDeckCount = [];

    for (var p = 1; p <= totalPlayers; p++) {
        updatedDeckCount.push(playerInfo["Player" + p].gameDeckLibrary.length);
    }
    return findLowest(updatedDeckCount);
}

function prepDeckListSharedPool(tempDeckList, totalPlayers, decksPerPlayer) {
    shuffleArray(tempDeckList);

    for (var p = 1; p <= totalPlayers; p++) {
        playerInfo["Player" + p].gameDeckLibrary = [];
        playerInfo["Player" + p].gameDeckLibrary = tempDeckList.splice(0, decksPerPlayer);
        playerInfo["Player" + p].gameDeckRandomLibrary = playerInfo["Player" + p].gameDeckLibrary.slice();
        alphaOrderDeckName(playerInfo["Player" + p].gameDeckLibrary);
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
    playerInfo["Player" + playerNumber].gameDeckRandomLibrary = playerInfo["Player" + playerNumber].gameDeckLibrary.slice();
    shuffleArray(playerInfo["Player" + playerNumber].gameDeckRandomLibrary);

}


//Task Masters

function findLowest(deckCount) {
    var lowest = deckCount[0];

    for (var i = 0; i < deckCount.length; i++) {
        if (deckCount[i] < lowest) {
            lowest = deckCount[i];
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

function updateLog(action) {
    gameLog.unshift(Date() + " " + action);
}

function unhideId(elem) {
    document.getElementById(elem).classList.remove('hide-item-class');
}

function hideId(elem) {
    document.getElementById(elem).classList.add('hide-item-class');
}

