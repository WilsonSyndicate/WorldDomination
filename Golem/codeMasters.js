//Code Masters

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
        var currentPlayerName = fullPlayerInfo.playerDecklist[findDeckRef(deckPlayer, deckName)].deckUniqueId.deckPlayer,
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
    if (logLength > 1 && lastLog[1].search("Begins") > 0) {
        logText.push("Game Duration: " + formatDuration(Date.parse(Date()) - lastLog[0]));
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