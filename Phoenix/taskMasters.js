//Task Masters

function removeDeckFromCountry(country) {
    delete country.deck;
}

function findDeckWithUniqueId(uniqueId) {
    return gameVars.playerInfo["Player" + uniqueId[0]].gameDeckRandomLibrary[findDeckRef(uniqueId[0], uniqueId[1], "random")];
}

function battleConsequenceEliminated(playerNumber, deckName) {
    //remove deck from country list
    removeDeckFromCountry(findDefendingCountry());

    //change deck status to eliminated
    findDeckWithUniqueId([playerNumber, deckName]).deckEliminated = true;

    console.log(deckName + " is eliminated from " + findDefendingCountry());
}

function battleConsequencePenalty(playerNumber, deckName) {
    findDeckWithUniqueId([playerNumber, deckName]).deckPenalties += 1;

    console.log(deckName + " gets a penalty and now has " + findDeckWithUniqueId([playerNumber, deckName]).deckPenalties);
}

function getSupplyPoint(playerNumber) {
    var nextSupplyPoint = gameVars.gameStatus.availableSupplyPoints.pop();

    gameVars.playerInfo["Player" + playerNumber].supplyPoints.push(nextSupplyPoint);

    console.log("player" + playerNumber + " gets a supply point of " + nextSupplyPoint);
}

function findCountryDeckIsOn(deckUniqueId) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (!!gameVars.mapInfo.countryList[i].deck && gameVars.mapInfo.countryList[i].deck.deckUniqueId === deckUniqueId) {
            return gameVars.mapInfo.countryList[i];
        }
    }
}

function findDeckWithUniqueId(deckUniqueId) {
    return gameVars.playerInfo["Player" + deckUniqueId[0]].gameDeckRandomLibrary[findDeckRef(deckUniqueId[0], deckUniqueId[1], "random")];
}

function deckMovesTo(playerNumber, deckName, destination) {
    var countryMovingFrom = findCountryDeckIsOn([playerNumber, deckName]),
    countryMovingTo = gameVars.mapInfo.countryList[findCountryRef(destination)],
    deckMoving = findDeckWithUniqueId(playerNumber, deckName);
    
    countryMovingTo.deck = deckMoving;
    delete countryMovingFrom.deck

    console.log(deckName + " moves to " + destination)
}

function findDeckNameWithPlayer(playerNumber) {
    for (var i = 0; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
        if (gameVars.battleScreenInfo.battleDecks[i].player === playerNumber) {
            return gameVars.battleScreenInfo.battleDecks[i].deck.deckName
        }
    }
}

function clearMapSelect() {
    gameVars.mapInfo.mapSelect1 = "";
    gameVars.mapInfo.mapSelect2 = "";
}

function countPreviousGames() {
    var previousGames = 0;

    for (var i = 0; i < gameVars.gameLog.length; i++) {
        if (gameVars.gameLog[i][1].slice(-17, 0) === "Battle Game Begins") {
            previousGames += 1;
        }
    }
    return previousGames;
}

function findDeckRef(playerNum, deckName, library) {
    var libraryLocation = gameVars.playerInfo["Player" + playerNum],
    libraryToSearch = "gameDeckLibrary";

    if (library === "random") {
        libraryToSearch = "gameDeckRandomLibrary";
    }
    for (var i = 0; i < libraryLocation[libraryToSearch].length; i++) {
        if (libraryLocation[libraryToSearch][i].deckName === deckName) {
            return i;
        }
    }
    return "Library Deck Ref Error";
}

function findCurrentCountryInfo(country) {
    var countryId = findCountryRef(country);

    return gameVars.mapInfo.countryList[countryId];
}

function findPlayerNameWithDeck(deck) {
    var playerNum = deck.player;

    return gameVars.playerInfo["Player" + playerNum].name
}

function displayCountryGUI(country) {
    var countryNameToShow = findCurrentCountryInfo(country).countryName,
    currentCountryDeck = findCurrentCountryInfo(country).deck;

    if (!!findCurrentCountryInfo(country).deck) {
        if (findCurrentCountryInfo(country).deck.isHidden === true) {
            //if country has deck and is hidden show (Player Name)
            return countryNameToShow + " (" + findPlayerNameWithDeck(currentCountryDeck) + ")";
        }
        else {
            //if country has deck and is not hiddend show (Deck Name from mapinfocountrylist)
            return countryNameToShow + " (" + findPlayerNameWithDeck(currentCountryDeck) + " playing " + 
             findCurrentCountryInfo(country).deck.deckName + ")";
        }
    }
    else {
        return countryNameToShow + " (Empty)";
    }
}

function convertArrayContentToNumbers(array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = Number(array[i]);
    }
}

function endOfTurnCleanup() {
    gameVars.battleScreenInfo.groundZero = "";
    gameVars.battleScreenInfo.text = "";
    gameVars.battleScreenInfo.playersInBattleCount = [];
    gameVars.battleScreenInfo.battleDecks = [];
    gameVars.battleScreenInfo.battleWinners = [];
    gameVars.battleScreenInfo.possibleAttacks = [];
    gameVars.battleScreenInfo.currentPlayerCountries = [];
    gameVars.battleScreenInfo.tempDeckInfo = [];
    gameVars.battleScreenInfo.alreadyAttacked = [];
}

function numberSuffix(number) {
    var lastDigit = number.toString().split('').pop();

    switch (lastDigit) {
        case "1": return number + "st";
        case "2": return number + "nd";
        case "3": return number + "rd";
        default: return number + "th";
    }
}

function findPlayerNames(playerNumberArray) {
    var playerNames = [];

    for (var i = 0; i < playerNumberArray.length; i++) {
        playerNames.push(gameVars.playerInfo["Player" + playerNumberArray[i]].name);
    }
    return playerNames;
}

function disableId(id) {
    document.getElementById(id).disabled = true;
    addClass(id, 'disabled');
}

function undisableId(id) {
    document.getElementById(id).disabled = false;
    removeClass(id, 'disabled');
}

function findNextPlayerTurn(currentPlayerNumber) {
    for (var i = 0; i < gameVars.gameStatus.turnOrder.length; i++) {
        if (gameVars.gameStatus.turnOrder[i] === currentPlayerNumber) {
            if (i === gameVars.gameStatus.turnOrder.length - 1) {
                return gameVars.gameStatus.turnOrder[0];
            }
            else {
                return gameVars.gameStatus.turnOrder[i + 1];
            }
        }
    }
}

function setIDBackgroundColor(Id, r, g, b) {
    document.getElementById(Id).style.backgroundColor = 'rgb(' + [(r),(g),(b)].join(',') + ')';
}

function findCountryRef(country) {
    for (var c = 0; c < gameVars.mapInfo.countryList.length; c++) {
        if (gameVars.mapInfo.countryList[c].country === country) {
            return c;
        }
    }
}

function findCountryLongName(country) {
    return gameVars.mapInfo.countryList[findCountryRef(country)].countryName;
}

function findCountryNameWithCountryId(countryId) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (countryId === gameVars.mapInfo.countryList[i].country) {
            return gameVars.mapInfo.countryList[i].countryName;
        }
    }
}

function findUniqueValuesInArray(array) {
    var uniqueArray = [];

    for (var i = 0; i < array.length; i++) {
        for (var u = 0; u < uniqueArray.length; u++) {
            if (array[i] !== uniqueArray[u]) {
                uniqueArray.push(array[i]);
            }
        }
    }
}

function findAttackingCountry() {
    if (findCountryPlayer(gameVars.mapInfo.mapSelect1) === gameVars.gameStatus.currentTurn) {
        return gameVars.mapInfo.mapSelect1;
    }
    else {
        return gameVars.mapInfo.mapSelect2;
    }
}

function findDefendingCountry() {
    if (findCountryPlayer(gameVars.mapInfo.mapSelect1) !== gameVars.gameStatus.currentTurn) {
        return gameVars.mapInfo.mapSelect1;
    }
    else {
        return gameVars.mapInfo.mapSelect2;
    }
}

function findCountryDeck(country) {
    if (!!gameVars.mapInfo.countryList[findCountryRef(country)].deck) {
        return gameVars.mapInfo.countryList[findCountryRef(country)].deck;
    }
    return false;
}

function findCountryPlayer(country) {
    if (country === "") {
        return false;
    }
    else {
        if (!!gameVars.mapInfo.countryList[findCountryRef(country)].deck) {
            return gameVars.mapInfo.countryList[findCountryRef(country)].deck.player;
        }
        else {
            return false;
        }
    }
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

function addClass(idToModify, classToAdd) {
    document.getElementById(idToModify).classList.add(classToAdd);
}

function removeClass(idToModify, classToRemove) {
    if (!!idToModify && document.getElementById(idToModify).classList.contains(classToRemove)) {
        document.getElementById(idToModify).classList.remove(classToRemove);
    }
}

function updateBattleLog (situationText) {
    var decksInGame = gameVars.battleScreenInfo.battleDecks,
    text = [situationText];

    for (var i = 0; i < decksInGame.length; i++) {
        var playerToAdd = decksInGame[i].player,
        playerNameToAdd = gameVars.playerInfo["Player" + playerToAdd].name + "'s",
        deckToAdd = decksInGame[i].deck.deckName,
        textToAdd = playerNameToAdd + " " + deckToAdd;
        
        text.push(textToAdd);
    }
    updateLog(text);
}

function isInArray(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return true;
        }
    }
    return false;
}

function addElement(addToId, elementType, elementContent, idToInclude, classToInclude, clickFunctionToInclude) {
    var newElement = document.createElement(elementType),//create a new element
    newContent = document.createTextNode(elementContent);//create content
    
    if (!!classToInclude && classToInclude !== "noClass") {
        newElement.classList.add(classToInclude);
    }
    
    if (!!idToInclude && idToInclude !== "noId") {
        newElement.id = idToInclude;
        if (!!clickFunctionToInclude && clickFunctionToInclude !== "noFunction") {
            newElement.onclick = function() { clickFunctionToInclude(idToInclude); };
        }
    }
    //add text node to new element
    newElement.appendChild(newContent);

    //add new element and contents to DOM
    var currentElement = document.getElementById(addToId);
    currentElement.appendChild(newElement);
}

function removeElement(parentId, elementId) {
    if (!!document.getElementById(parentId) && document.getElementById(elementId) !== null) {
        document.getElementById(parentId).removeChild(document.getElementById(elementId));
    }
}

function removeDuplicatesInArray(array) {
    var newArray = [];

    orderSimpleArray(array);

    for (var c = 0; c < array.length; c++) {
        if (array[c] !== array[c + 1]) {
            newArray.push(array[c]);
        }
    }
    return newArray;
}

function findCountryPlayer(countryName) {
    if (countryName !== "" && !!gameVars.mapInfo.countryList[findCountryRef(countryName)].deck) {
        return gameVars.mapInfo.countryList[findCountryRef(countryName)].deck.player;
    }
}

function findCountryBorders(countryName) {
    var borders = [];

    for (var i = 0; i < gameVars.mapInfo.countryList[findCountryRef(countryName)].borders.length; i++) {
        borders.push(gameVars.mapInfo.countryList[findCountryRef(countryName)].borders[i]);
    }
    return borders;
}

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
    var logText = [],
    logLength = gameVars.gameLog.length,
    lastLog = gameVars.gameLog[logLength - 1];

    logText.push(Date.parse(Date()));
    for (var i = 0; i < text.length; i++) {
        logText.push(text[i]);
    }
    if (logLength > 1 && lastLog[1].search("Begins") > 0) {
        logText.push("Game Duration: " + formatDuration(Date.parse(Date()) - lastLog[0]));
    }
    gameVars.gameLog.push(logText);
    console.log(logText);
}

function calcDuration(duration) {
    //parts borrowed from Stack Overflow https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
    let remain = duration;

    let days = Math.floor(remain / (1000 * 60 * 60 * 24));
    remain = remain % (1000 * 60 * 60 * 24);
  
    let hours = Math.floor(remain / (1000 * 60 * 60));
    remain = remain % (1000 * 60 * 60);
  
    let minutes = Math.floor(remain / (1000 * 60));
    remain = remain % (1000 * 60);
  
    let seconds = Math.floor(remain / (1000));
    remain = remain % (1000);
  
    let milliseconds = remain;

    return {
        days, 
        hours, 
        minutes, 
        seconds, 
        milliseconds
    };
}

function formatDuration(duration) {
    var time = calcDuration(duration);

    let days = time.days.toString();
    if (days.length === 1) days = '0' + days;

    let hours = time.hours.toString();
    if (hours.length === 1) hours = '0' + hours;
  
    let minutes = time.minutes.toString();
    if (minutes.length === 1) minutes = '0' + minutes;
  
    let seconds = time.seconds.toString();
    if (seconds.length === 1) seconds = '0' + seconds;
  
    return days + ":" + hours + ":" + minutes + ":" + seconds;
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