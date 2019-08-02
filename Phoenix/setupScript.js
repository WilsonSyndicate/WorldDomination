
//look up double bang !! info




//Runtime

function countPlayerDecks(playerNumber) {
    var deckCount = 0;

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (typeof gameVars.mapInfo.countryList[i].deck !== "undefined" &&
         playerNumber === gameVars.mapInfo.countryList[i].deck.player)
        deckCount += 1;
    }
    return deckCount;
}

function updateCountryWithDeck(country, deck) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (country === gameVars.mapInfo.countryList[i].country) {
            gameVars.mapInfo.countryList[i].deck = deck;
            updateDOMElement(country, countryMapName(gameVars.mapInfo.countryList[i]));
        }
    }
}

function checkForSetupFinish() {
    var countryCount = gameVars.mapInfo.countryList.length,
    playerCount = gameVars.globalGameOptions.totalPlayers,
    countriesPerPlayer = Math.floor(countryCount/playerCount),
    totalSetupCountries = (countriesPerPlayer * playerCount),
    placedCountries = 0;

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (typeof gameVars.mapInfo.countryList[i].deck !== "undefined") {
            placedCountries += 1;
        }
    }
    if (totalSetupCountries === placedCountries) {
        for (var c = 0; c < countryCount; c++) {
            undisableId(gameVars.mapInfo.countryList[c].country);
        }
        settopOfTurn(gameVars.gameStatus.currentTurn);
    }
}

function placeCountry(country) {
    var currentTurn = gameVars.gameStatus.currentTurn,
    deckIdToPlace = countPlayerDecks(currentTurn) + 1,
    deckToPlace = gameVars.playerInfo["Player" + currentTurn].gameDeckRandomLibrary[deckIdToPlace];

    updateCountryWithDeck(country, deckToPlace);
    gameVars.gameStatus.currentTurn = findNextPlayerTurn(currentTurn);
    disableId(country);
    checkForSetupFinish();
}

function countryMapName(currentCountryId) {
    if (currentCountryId.deck) {
        var useDeckName = currentCountryId.deck.deckName,
        usePlayerName = gameVars.playerInfo["Player" + currentCountryId.deck.player].name;

        if (currentCountryId.deck.unHidden) {
            //shows deck name once currentCountryId.deck.unHidden === true
            return usePlayerName + " (" + useDeckName + ")";
        }
        else {
            return currentCountryId.countryName + " (" + usePlayerName + ")";
        }
    }
    else {
        return currentCountryId.countryName + " (Empty)";
    }
}

function BuildMapButtons() {
    var totalCountries = gameVars.mapInfo.countryList.length;
    
    for (var i = 0; i < totalCountries; i++) {
        var currentCountry = gameVars.mapInfo.countryList[i].country,
        currentCountryId = gameVars.mapInfo.countryList[i];

        removeElement("map-countries", currentCountry);
        addElement("map-countries", "button", countryMapName(currentCountryId), currentCountry, "country-button", mapCountryClick);
    }
}

function findBattleDeckName(playerId) {
    var battleDecks = gameVars.battleScreenInfo.battleDecks,
    nameToFind = "";

    for (var i = 0; i < battleDecks.length; i ++) {
        var currentBattleDeck = battleDecks[i].player;

        if (playerId == currentBattleDeck) {
            nameToFind = gameVars.battleScreenInfo.battleDecks[i].deck.deckName;
        }
    }
    return nameToFind;
}

function gameResultsLogText(confirmationResults, orderOfWinners) {
    var resultsLogText = [];

    //add game duration and consequence to log

    for (var i = 0; i < confirmationResults.length; i++) {
        var currentDeckName = findBattleDeckName(orderOfWinners[i]);

        resultsLogText.push(confirmationResults[i] + " with " + currentDeckName);
    }
    return resultsLogText;
}

function clearBattleScreenInfo() {
    gameVars.battleScreenInfo.groundZero = "";
    gameVars.battleScreenInfo.text = "";
    gameVars.battleScreenInfo.playersInBattleCount = [];
    gameVars.battleScreenInfo.battleDecks = [];
    gameVars.battleScreenInfo.battleWinners = [];
}

function getRandomSetup() {
    var countryCount = gameVars.mapInfo.countryList.length,
    playerCount = gameVars.globalGameOptions.totalPlayers,
    countriesPerPlayer = Math.floor(countryCount/playerCount),
    deckListToAdd = [],
    countryListToAddTo = gameVars.mapInfo.countryList.slice();

    for (var p = 1; p <= playerCount; p++) {
        for (var i = 1; i <= countriesPerPlayer; i++) {
            var currentDeck = gameVars.playerInfo["Player" + p].gameDeckRandomLibrary[i];
            
            deckListToAdd.push(currentDeck);
        }
    }
    shuffleArray(deckListToAdd);
    shuffleArray(countryListToAddTo);
    for (var c = 0; c < deckListToAdd.length; c++) {
        countryListToAddTo[c].deck = deckListToAdd[c];
    }
    orderArray(countryListToAddTo, "country")
    gameVars.mapInfo.countryList = countryListToAddTo;
}

function findPlayerColor(playerId) {
    var playerColor = gameVars.playerInfo["Player" + playerId].playerColor;

    return playerColor;
}

function findPlayerCountryColor(country, colorRef) {
    var playerId = country.deck.deckAuthor;

    return findPlayerColor(playerId)[colorRef];
}


function isSurrounded(country, player) {
    var answer = true;

    for (var i = 0; i < country.borders.length; i++) {
        var currentCountryBorderCountry = gameVars.mapInfo.countryList[findCountryRef(country.borders[i])];

        if (!!currentCountryBorderCountry.deck && player !== currentCountryBorderCountry.deck.player) {
            answer = false;
        }
    }
    return answer;
}

function isSharingBorder(country, player) {
    var answer = false;

    for (var i = 0; i < country.borders.length; i++) {
        var currentCountryBorderCountry = gameVars.mapInfo.countryList[findCountryRef(country.borders[i])];

        if (!!currentCountryBorderCountry.deck && currentCountryBorderCountry.deck.player === player) {
            answer = true;
        }
    }

    return answer;
}

function refreshMapButtonColors() {
    var currentPlayer = gameVars.gameStatus.turn;

    //check for unoccupied countries and player color
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        var currentCountry = gameVars.mapInfo.countryList[i];

        removeClass(currentCountry.country, "attack-impossible");

        if (!!currentCountry.deck) {
            setIDBackgroundColor(currentCountry.country, findPlayerCountryColor(currentCountry, [0]), 
            findPlayerCountryColor(currentCountry, [1]), findPlayerCountryColor(currentCountry, [2]));

            setIdWithPlayerTextColor(currentCountry.country, currentCountry.deck.player);

            if (gameVars.gameStatus.mode === "attack") {
                //check for not current player countries without current player as border
                if (currentPlayer !== currentCountry.deck.player) {
                    if (!isSharingBorder(currentCountry, currentPlayer)) {
                        disableId(currentCountry.country);
                        addClass(currentCountry.country, "attack-impossible");
                    }
                }
                //check for current player countries surrounded by current player
                else {
                    if (isSurrounded(currentCountry, currentPlayer)) {
                        disableId(currentCountry.country);
                        addClass(currentCountry.country, "attack-impossible");
                    }
                }
    
                //check for attack mode and countries that already attacked

            }
        }
        else {
            if (gameVars.gameStatus.mode === "attack") {
                disableId(currentCountry.country);
            }
        }
    }

    //check for move mode and for countries not owned by current player


    //check for drop mode and for countries that have already been dropped

}



function setupBoard(confirmationResults, orderOfWinners) {
    var logText = gameResultsLogText(confirmationResults, orderOfWinners);

    gameVars.gameStatus.turnOrder = orderOfWinners;
    gameVars.gameStatus.turn = parseInt(orderOfWinners[0]);
    updateLog(logText);
    gameVars.gameStatus.currentTurn = gameVars.gameStatus.turnOrder[0];
    clearBattleScreenInfo();
    hideId("battle-screen");
    unhideId("map-screen");
    if (gameVars.globalGameOptions.randomMapSetup === true) {
        getRandomSetup();
        settopOfTurn(gameVars.gameStatus.turnOrder[0])
        }
    else {
        gameVars.gameStatus.mode = "placement";
    }
    BuildMapButtons();
    refreshMapButtonColors();
}

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
    addPlayerToDecklists();
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
    gameVars.playerInfo["Player" + currentPlayer].playerColor[color] = parseInt(value);

    refreshColorShown(currentPlayer);
}

function clearSetupDeckList() {
    var parentToClear = "library-table-container",
    childToClear = "setup-player-decklist-table";

    removeElement(parentToClear, childToClear)
}

function setupPlayerChange() {
    var playerNum = document.getElementById("player-drop-select").value;

    gameVars.playerScreenOptions.activeSetupPlayer = playerNum;
    refreshPlayerSetupInformation();
}

function refreshNameShown(selectedPlayer) {
    var nameToShow = gameVars.playerInfo["Player" + selectedPlayer].name,
    placeToShow = document.getElementById("name-to-show");

    placeToShow.innerHTML = nameToShow;
    refreshDeckAuthor();
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
    
    clearSetupDeckList();

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
    for (var p = 1; p <= gameVars.globalGameOptions.totalPlayers; p++) {
        var currentLibrary = gameVars.playerInfo["Player" + p].gameDeckLibrary

        for (var d = 0; d < currentLibrary.length; d++) {
            var currentDeckAuthorNumber = gameVars.playerInfo["Player" + p].gameDeckLibrary[d].deckAuthor,
            currentDeckAuthorName = gameVars.playerInfo["Player" + currentDeckAuthorNumber].name;

            currentLibrary[d].deckAuthorName = currentDeckAuthorName;
        }
    }
}

function addPlayerToDecklists() {
    for (var p = 1; p <= gameVars.globalGameOptions.totalPlayers; p++) {
        for (var i = 0; i < gameVars.playerInfo["Player" + p].gameDeckRandomLibrary.length; i++) {
            var currentRandomDeck = gameVars.playerInfo["Player" + p].gameDeckRandomLibrary[i],
            currentDeck = gameVars.playerInfo["Player" + p].gameDeckLibrary[i];
            
            currentRandomDeck.player = p;
            currentDeck.player = p;
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

    orderArray(gameVars.playerInfo["Player" + playerNum].gameDeckLibrary, "deckName");
}

function createPlayerInfo (plNum) {
    gameVars.playerInfo["Player" + plNum] = {
        name: "Player" + plNum,
        player: parseInt(plNum),
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
        orderArray(gameVars.playerInfo["Player" + p].gameDeckLibrary, "deckName");
    }
}

function prepDeckListNotSharedNormalizedPool(playerNumber, normalizedDeckCount) {
    shuffleArray(playerInfo["Player" + playerNumber].gameDeckLibrary);
    playerInfo["Player" + playerNumber].gameDeckRandomLibrary = 
    playerInfo["Player" + playerNumber].gameDeckLibrary.slice(0, normalizedDeckCount);
    playerInfo["Player" + playerNumber].gameDeckLibrary = 
    playerInfo["Player" + playerNumber].gameDeckRandomLibrary.slice();
    orderArray(playerInfo["Player" + playerNumber].gameDeckLibrary, "deckName");
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

function orderArray(array, sortBy) {
    array.sort(function(a, b) {
        if (a[sortBy].toUpperCase() < b[sortBy].toUpperCase()) { return -1; }
        if (a[sortBy].toUpperCase() > b[sortBy].toUpperCase()) { return 1;}
    })
}

function orderSimpleArray(array) {
    array.sort(function(a, b) {
        if (a.toUpperCase() < b.toUpperCase()) { return -1; }
        if (a.toUpperCase() > b.toUpperCase()) { return 1;}
    })
}

function shuffleArray(arrayToShuffle) {
    //Found on stackoverflow
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
    gameVars.gameLog.push([Date(),text]);
}

function unhideId(elem) {
    document.getElementById(elem).classList.remove('hide-item-class');
}

function hideId(elem) {
    document.getElementById(elem).classList.add('hide-item-class');
}

function updateDOMElement(elementId, text) {
    document.getElementById(elementId).innerHTML = text;
}

function setIdWithPlayerTextColor(id, player) {
    var currentPlayerTextColor = gameVars.playerInfo["Player" + player].textColor;

    document.getElementById(id).style.color = currentPlayerTextColor;
}