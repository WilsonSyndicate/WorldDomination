
//Runtime

// player number, name, color updates

function refreshNameShown(selectedPlayer) {
    var nameToShow = playerInfo["Player" + selectedPlayer].name,
    placeToShow = document.getElementById("name-to-show");

    placeToShow.innerHTML = nameToShow;
}

function refreshColorShown(selectedPlayer) {
    var r = playerInfo["Player" + selectedPlayer].playerColor[0],
    g = playerInfo["Player" + selectedPlayer].playerColor[1],
    b = playerInfo["Player" + selectedPlayer].playerColor[2],
    colorToShow = 'rgb(' + [(r),(g),(b)].join(',') + ')';

    document.body.style.backgroundColor = colorToShow;
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
    switch (globalGameOptions.sharedDeckPool) {
        case true:
            var decksToAdd = [];
            
            for (var p = 1; p <= globalGameOptions.totalPlayers; p++) {
                decksToAdd = decksToAdd.concat(masterDeckList["deckListPlayer" + p]);
            }
            playerInfo['Player' + playerNum].gameDeckLibrary = decksToAdd;
        break;

        default:
            var listToUse = masterDeckList["deckListPlayer" + playerNum];

            playerInfo['Player' + playerNum].gameDeckLibrary = listToUse;
    }

    playerInfo["Player" + playerNum].gameDeckLibrary.sort(function(a, b) {
        if (a.deckName < b.deckName) { return -1; }
        if (a.deckName > b.deckName) { return 1;}
    })
}

function createPlayerInfo (plNum) {
    playerInfo["Player" + plNum] = {
        name: "Player" + plNum,
        player: plNum,
        playerColor: [255,255,255],
        textColor: [0,0,0],
        gameDeckLibrary: [],
        gameDeckOrderedLibrary: []
    };
}

function createPlayerOptions() {
    var playerSelect = document.createElement("select");
    var container = document.getElementById("player-dropdown-select-container")

    for (var i = 1; i <= globalGameOptions.totalPlayers; i++) {
        var option = document.createElement("option");  //Uses the option as a container for created elements

        option.innerHTML = i; //makes an option for each player
        playerSelect.appendChild(option); //appends each option to the variable outside the loop

        createPlayerInfo(i);
        loadDeckLists(i);  
    };
    container.appendChild(playerSelect); //appends the container list to the DOM
}

function beginPlayerSetup() {
    globalGameOptions.totalPlayers = document.getElementById("update-player-count").value
    
    if(document.getElementById("shared-deck-pool").checked === true) {
        globalGameOptions.sharedDeckPool = true
    } else {
        globalGameOptions.sharedDeckPool = false
    };

    if(document.getElementById("random-map-setup").checked === true) {
        globalGameOptions.randomMapSetup = true
    } else {
        globalGameOptions.randomMapSetup = false
    };

    if(confirm("Are you sure you want these options for this game?\n Total Players: " + globalGameOptions.totalPlayers + 
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


//Task Masters

function tfyn(tf) {
    switch (tf) {
        case true:
            return "Yes";

        default:
            return "No";
    }
}

function updateLog(action) {
    gameLog.push(Date(),action);
}

function unhideId(elem) {
    document.getElementById(elem).classList.remove('hide-item-class');
}

function hideId(elem) {
    document.getElementById(elem).classList.add('hide-item-class');
}

