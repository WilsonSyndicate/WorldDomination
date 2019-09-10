//Code Masters

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

function findCountryPlayer(fullCountry) {
    if (!!country.deck) {
        var deckPlayer = fullCountry.deck.deckPlayer,
        deckName = fullCountry.deck.deckName;

        return findDeckWithPlayerNumberAndName(deckPlayer, deckName);
    }
    else {
        console.log("no deck on country");
    }
}

function findUniqueValuesInArray(array) {
    var uniqueArray = [];

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

