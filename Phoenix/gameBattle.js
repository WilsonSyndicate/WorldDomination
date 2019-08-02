




function countBattleLife(battleDeckRef) {
    return ["Life: ", 20];
}

function countBattleHand(battleDeckRef) {
    return ["Hand: ", 7];
}

function countBattlePower(battleDeckRef) {
    return "";
}

function countBattleToughness(battleDeckRef) {
    return "";
}

function battleVanguard(battleDeckRef) {
    return "";
}

function battleDefensePlane(battleDeckRef) {
    return "";
}

function countCountrySupport(battleDeckRef) {
    return "";
}

function continentBonuses(battleDeckRef) {
    return "";
}

function battleHero(battleDeckRef) {
    return "";
}

function battleConspiracy(battleDeckRef) {
    return "";
}

function countBattleBonuses(battleDeckRef) {
    return "";
}

function countBattlePenalties(battleDeckRef) {
    return "";
}

function displayBattleInfo(battleDeckRef) {
    var currentPlayer = gameVars.battleScreenInfo.battleDecks[battleDeckRef].player,
    currentPlayerName = gameVars.playerInfo["Player" + currentPlayer].name,
    currentDeck = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deck.deckName,
    currentDeckColor = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deck.deckColor,
    r = gameVars.playerInfo["Player" + currentPlayer].playerColor[0],
    g = gameVars.playerInfo["Player" + currentPlayer].playerColor[1],
    b = gameVars.playerInfo["Player" + currentPlayer].playerColor[2],
    battleText = [
        currentPlayerName + " playing " + currentDeck + " (" + currentDeckColor + ")"
    ],
    gameMods = [
        countBattleLife(battleDeckRef),
        countBattleHand(battleDeckRef),
        countBattlePower(battleDeckRef),
        countBattleToughness(battleDeckRef),
        battleVanguard(battleDeckRef),
        battleDefensePlane(battleDeckRef),
        countCountrySupport(battleDeckRef),
        continentBonuses(battleDeckRef),
        battleHero(battleDeckRef),
        battleConspiracy(battleDeckRef),
        countBattleBonuses(battleDeckRef),
        countBattlePenalties(battleDeckRef)
    ];

    //add player and deck name (color)
    addElement("battle-information", "div",battleText, 
    "battle-player" + battleDeckRef, "battle-player");
    
    //create buttons
    addElement("battle-player" + battleDeckRef, "button", currentPlayerName, 
    "battle-winner-" + currentPlayer, "noClass", battleWinner);

    //color buttons
    setIDBackgroundColor("battle-winner-" + currentPlayer, r, g, b)
    setIdWithPlayerTextColor("battle-winner-" + currentPlayer, currentPlayer);

    //for each battle player show player, deck, life, cards
    for (var d = 0; d < gameMods.length; d++) {
        if (gameMods[d] !== "") {
            var gameModsCurrentText = gameMods[d][0] + gameMods[d][1]
            addElement("battle-player" + battleDeckRef, "div", gameModsCurrentText);
        }
    }
}

function BattleDeck(deck, player) {
    this.player = player;
    this.deck = deck;
}

function deckChooser(plyrNum) {
    if (gameVars.gameStatus.mode === "setup") {
        return gameVars.playerInfo["Player" + plyrNum].gameDeckRandomLibrary[0];
    }
    else {
        //add deck from map choice
        //find ground zero
        //tally all bonuses and penalties
    }
}

function setupBattleInfo() {
    var decksInGame = gameVars.battleScreenInfo.playersInBattleCount;

    for (var i = 0; i < decksInGame.length; i++) {
        var battleDeck = new BattleDeck(deckChooser(decksInGame[i]), decksInGame[i]);

        gameVars.battleScreenInfo.battleDecks.push(battleDeck);
    }
}

function openBattleScreen() { //from setup with screen cleared
    var battleParticipants = gameVars.battleScreenInfo.battleDecks;  
    setupBattleInfo();
    updateBattleLog("Initiation Battle Begins");
    for (var i = battleParticipants.length - 1; i >= 0; i--) {
        displayBattleInfo(i);
    }
}


//Task Masters
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