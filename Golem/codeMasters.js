//Code Masters
function stringToDate(string) {
    var newDate = Date(string),
    parts = newDate.split(' '),
    findTimeZone = [];

    //WeekDay = parts[0],
    //Month = parts[1],
    //Day = parts[2],
    //Year = parts[3],
    //Time = parts[4],
    //TimeZoneDiff = parts[5],

    for (var i = 6; i <= parts.length; i++) {
        findTimeZone.push(parts[i]);
    }
    return [parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], findTimeZone];
}

function getNextTurn() {
    for (var i = 0; i < gameVars.gameStatus.turnOrder.length; i++) {
        var currentTurn = gameVars.gameStatus.turn,
        lastTurn = gameVars.gameStatus.turnOrder[gameVars.gameStatus.turnOrder.length - 1];

        if (currentTurn === lastTurn) {
            return gameVars.gameStatus.turnOrder[0];
        }
        else if (gameVars.gameStatus.turnOrder[i] === currentTurn) {
            return gameVars.gameStatus.turnOrder[i + 1];
        }
    }
}

function countItemsInArray(item, array) {
    var count = 0;

    for (var i = 0; i < array.length; i++) {
        if (array[i] === item) {
            count += 1;
        }
    }
    return count;
}

function playerCounrtyList(player) {
    var countryList = [];

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (!!gameVars.mapInfo.countryList[i].deck && gameVars.mapInfo.countryList[i].deck.deckPlayer === player) {
            countryList.push(gameVars.mapInfo.countryList[i].country);
        }
    }
    return countryList;
}

function removeItemFromArray(itemToRemove, array) {
    var newArray = [];

    for (var i = 0; i < array.length; i++) {
        if (array[i] !== itemToRemove) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

function findFullPlayerWithPlayerNumber(playerNumber) {
    for (var i = 1; i <= gameVars.globalGameOptions.totalPlayers; i++) {
        if (playerNumber === i) {
            return gameVars.playerInfo["player" + i];
        }
    }
}

function isItemInArray(item, array) {
    for (var i = 0; i < array.length; i++) {
        if (item === array[i]) {
            return true;
        }
    }
    return false;
}

function findFullCountryWithDeckPlayerAndDeckName(deckPlayer, deckName) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (!!gameVars.mapInfo.countryList[i].deck && gameVars.mapInfo.countryList[i].deck.deckPlayer === deckPlayer && gameVars.mapInfo.countryList[i].deck.deckName === deckName) {
            return gameVars.mapInfo.countryList[i];
        }
    }
}

function doesCountryBorderFullCountry(country, fullCountry) {
    for (var i = 0; i < fullCountry.borders.length; i++) {
        if (fullCountry.borders[i] === country) {
            return true;
        }
    }
    return false;
}

function findFullDeckWithPlayerAndName(deckPlayer, deckName) {
    return gameVars.playerInfo["player" + deckPlayer].playerDecklist[findDeckRef(deckPlayer, deckName)]
}

function findFullCountryWithCountry(country) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].country === country) {
            return gameVars.mapInfo.countryList[i];
        }
    }
}

function findDeckRef(deckPlayer, deckName) {
    for (var i = 0; i < gameVars.playerInfo["player" + deckPlayer].playerDecklist.length; i++) {
        var currentDeck = gameVars.playerInfo["player" + deckPlayer].playerDecklist[i];

        if (deckName === currentDeck.deckName) {
            return i;
        }
    }
}

function shownDeckName(deckPlayer, deckName) {
    var fullPlayerInfo = gameVars.playerInfo["player" + deckPlayer];

    if (fullPlayerInfo.playerDecklist[findDeckRef(deckPlayer, deckName)].deckName === deckName) {
        var currentPlayerName = findPlayerName(deckPlayer),
        currentDeckName = fullPlayerInfo.playerDecklist[findDeckRef(deckPlayer, deckName)].deckName;

        if (fullPlayerInfo.playerDecklist[findDeckRef(deckPlayer, deckName)].deckHidden === true) {
            return currentPlayerName + "'s deck";
        }
        else {
            return currentPlayerName + "'s " + currentDeckName;
        }
    }
}

function showPregame() {
    hideId("intro-screen");
    hideId("battle-screen");
    hideId("map-screen");
    gameVars.gameStatus.focus = "pre-game";
    unhideId("pre-game-screen");
}

function showBattle() {
    hideId("pre-game-screen");
    hideId("intro-screen");
    hideId("map-screen");
    gameVars.gameStatus.focus = "attack";
    unhideId("battle-screen");
}

function showIntro() {
    hideId("pre-game-screen");
    hideId("battle-screen");
    hideId("map-screen");
    gameVars.gameStatus.focus = "intro";
    unhideId("intro-screen");
    updateIntroScreen();
}

function showMap() {
    hideId("pre-game-screen");
    hideId("battle-screen");
    hideId("intro-screen");
    gameVars.gameStatus.focus = "map";
    unhideId("map-screen");
}

function findCountryPlayer(country) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].country === country && !!gameVars.mapInfo.countryList[i].deck) {
            return gameVars.mapInfo.countryList[i].deck.deckPlayer;
        }
    }
}

function findUniqueValuesInArray(array) {
    var uniqueArray = [];

    //remove duplicates
    uniqueArray.push(array[0]);
    for (var i = 1; i < array.length; i++) {
        var currentArrayItem = array[i];

        if (uniqueArray.indexOf(currentArrayItem) === -1) {
            uniqueArray.push(currentArrayItem);
        }
    }
    return uniqueArray;
}

function disableId(id) {
    document.getElementById(id).disabled = true;
    addClass(id, 'disabled');
}

function undisableId(id) {
    document.getElementById(id).disabled = false;
    removeClass(id, 'disabled');
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

function findCountryRef(country) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].country === country) {
            return i;
        }
    }
}

function findDeckWithCountry(country) {
    if (!!gameVars.mapInfo.countryList[findCountryRef(country)].deck) {
        return gameVars.mapInfo.countryList[findCountryRef(country)].deck;
    }
}

function findDeckWithPlayerNumberAndName(playerNumber, deckName) {
    var currentPlayer = gameVars.playerInfo["player" + playerNumber];
        
    for (var i = 0; i < currentPlayer.playerDecklist.length; i++) {
        if (currentPlayer.playerDecklist[i].deckName === deckName) {
            return currentPlayer.playerDecklist[i];
        }
    }
}

function findDeckWithPlayerAndRef(playerNumber, deckRef) {
    return gameVars.playerInfo["player" + playerNumber].playerDecklist[deckRef];
}

function findArrayOfPlayerNames(playerNumberArray) {
    var playerNames = [];

    for (var i = 0; i < playerNumberArray.length; i++) {
        playerNames.push(findPlayerName(playerNumberArray[i]));
    }
    return playerNames;
}

function findPlayerName(playerNumber) {
    return gameVars.playerInfo["player" + playerNumber].playerName;
}

function addMapArea(addToId, idToInclude) {
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");//create a new svg element 

    //add id
    newElement.id = idToInclude;
    //add new element and contents to DOM
    var currentElement = document.getElementById(addToId);
    currentElement.appendChild(newElement);   
}

function addMapElement(addToId, elementContent, idToInclude, classToInclude, clickFunctionToInclude, hoverFunctionToInclude, offHoverFunctionToInclude) {
    var countryArea = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    //country area
    countryArea.setAttributeNS(null, "d", countryShapes[idToInclude].path);
    //add id
    countryArea.id = idToInclude;
    //add functions
    if (!!clickFunctionToInclude && clickFunctionToInclude !== "noFunction") {
        countryArea.onclick = function() { clickFunctionToInclude(countryArea.id); };
    }
    if (!!hoverFunctionToInclude && hoverFunctionToInclude !== "noHover") {
        countryArea.onmouseover = function() { hoverFunctionToInclude(countryArea.id); };
    }
    if (!!offHoverFunctionToInclude && offHoverFunctionToInclude !== "noOffHover") {
        countryArea.onmouseout = function() { offHoverFunctionToInclude(countryArea.id); };
    }
    //add class
    countryArea.classList.add(classToInclude);
    //append path to svg
    document.getElementById(addToId).appendChild(countryArea);
    //country label
    addElement("text-countries", "div", elementContent, idToInclude + "-text", "country-text");
}



function addElement(addToId, elementType, elementContent, idToInclude, classToInclude, clickFunctionToInclude, hoverFunctionToInclude, offHoverFunctionToInclude) {
    var newElement = document.createElement(elementType);//create a new element

    //add class
    if (!!classToInclude && classToInclude !== "noClass") {
        newElement.classList.add(classToInclude);
    }
    //add functions
    if (!!idToInclude && idToInclude !== "noId") {
        newElement.id = idToInclude;

        if (!!clickFunctionToInclude && clickFunctionToInclude !== "noFunction") {
            newElement.onclick = function() { clickFunctionToInclude(idToInclude); };
        }
        if (!!hoverFunctionToInclude && hoverFunctionToInclude !== "noHover") {
            newElement.onmouseover = function() { hoverFunctionToInclude(idToInclude); };
        }
        if (!!offHoverFunctionToInclude && offHoverFunctionToInclude !== "noOffHover") {
            newElement.onmouseout = function() { offHoverFunctionToInclude(idToInclude); };
        }
    }
    //add text
    if (elementContent.indexOf("<") !== 0 && elementContent !== "noContent") {
        //create content node
        newContent = document.createTextNode(elementContent);
        //add text node to new element
        newElement.appendChild(newContent);
    }
    //add new element and contents to DOM
    var currentElement = document.getElementById(addToId);
    currentElement.appendChild(newElement);
    //add html text
    if (elementContent.indexOf("<") === 0) {
        //create innerHTML text
        document.getElementById(idToInclude).innerHTML = elementContent;
    } 
}

function removeElement(parentId, elementId) {
    if (!!document.getElementById(parentId) && document.getElementById(elementId) !== null) {
        document.getElementById(parentId).removeChild(document.getElementById(elementId));
    }
}

function gameCount() {
    var count = 0;

    for (var i = 0; i < gameVars.gameLog.length; i++) {
        var endGameLogs = gameVars.gameLog[i][1].slice(-8);

        if (endGameLogs === "Complete") {
            count += 1;
        }
    }
    return count;
}

function updateLog(text) {
    var logText = [],
    logLength = gameVars.gameLog.length,
    lastLog = gameVars.gameLog[logLength - 1];

    logText.push(Date.parse(Date()));
    for (var i = 0; i < text.length; i++) {
        logText.push(text[i]);
    }
    if (logLength > 0 && lastLog[1].search("Begins") !== -1) {
        logText.push("Game Duration: " + formatDuration(Date.parse(Date()) - lastLog[0]));
    }
    if (logLength > 0 && logText[1].search("Begins") !== -1) {
        logText.push(gameVars.gameStatus.turn);
        logText.push(gameVars.battleScreenInfo.battleDecks);
    }
    gameVars.gameLog.push(logText);
}

function orderArray(array, sortBy) {
    array.sort(function(a, b) {
        if (a[sortBy].toUpperCase() < b[sortBy].toUpperCase()) { return -1; }
        if (a[sortBy].toUpperCase() > b[sortBy].toUpperCase()) { return 1;}
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

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function addClass(idToModify, classToAdd) {
    document.getElementById(idToModify).classList.add(classToAdd);
}

function removeClass(idToModify, classToRemove) {
    if (!!idToModify && document.getElementById(idToModify).classList.contains(classToRemove)) {
        document.getElementById(idToModify).classList.remove(classToRemove);
    }
}

function unhideId(id) {
    document.getElementById(id).classList.remove('hide-item-class');
}

function hideId(id) {
    document.getElementById(id).classList.add('hide-item-class');
}

function updateDOMElement(id, text) {
    document.getElementById(id).innerHTML = text;
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