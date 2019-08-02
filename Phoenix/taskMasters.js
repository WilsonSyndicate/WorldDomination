//Task Masters

function numberSuffix(number) {
    switch (number) {
        case 1: return "1st";
        case 2: return "2nd";
        case 3: return "3rd";
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

function findCountryNameWithCountryId(countryId) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (countryId === gameVars.mapInfo.countryList[i].country) {
            return gameVars.mapInfo.countryList[i].countryName;
        }
    }
}

function findCountryPlayer(country) {
    if (country === "") {
        return false;
    }
    else {
        if (typeof gameVars.mapInfo.countryList[findCountryRef(country)].deck) {
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

function addElement(addToId, elementType, elementContent, idToInclude, classToInclude, clickFunctionToInclude) {
    var newElement = document.createElement(elementType),//create a new element
    newContent = document.createTextNode(elementContent);//create content

    
    if (classToInclude !== undefined && classToInclude !== "noClass") {
        newElement.classList.add(classToInclude);
    }
    
    if (idToInclude !== undefined && idToInclude !== "noId") {
        newElement.id = idToInclude;
        if (clickFunctionToInclude !== undefined && clickFunctionToInclude !== "noFunction") {
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
    if (typeof(document.getElementById(parentId)) !== undefined && document.getElementById(elementId) !== null) {
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
    return gameVars.mapInfo.countryList[findCountryRef(countryName)].deck.player;
}

function findCountryBorders(countryName) {
    var borders = [];

    for (var i = 0; i < gameVars.mapInfo.countryList[findCountryRef(countryName)].borders.length; i++) {
        borders.push(gameVars.mapInfo.countryList[findCountryRef(countryName)].borders[i]);
    }
    return borders;
}