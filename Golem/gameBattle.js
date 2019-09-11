




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




function attackChosen() {


    console.log("attack confirmed");

    //update battle decks

    //load game mods

    //change focus




    //go to battle screen 

    //future version
    //check if deck has defended, if not go to plane chooser


}




function battleScreenCleanup() {
    //clear cancel and win buttons
    removeElement("battle-screen-toolbar", "reset-winners");
    removeElement("battle-screen-toolbar", "confirm-winners");

    //clear deck info and buttons
    for (var i = 0; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
        removeElement("battle-information", "battle-player" + i);
    }

    //clear battle variables
    gameVars.battleScreenInfo.battlePlayersCount = [];
    gameVars.battleScreenInfo.battleDecks = [];
    gameVars.battleScreenInfo.battleWinners = [];
    gameVars.battleScreenInfo.groundZero = "";
}

function findBattleDeckNameWithPlayer(currentBattlePlayer) {
    for (var i = 0; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
        if (gameVars.battleScreenInfo.battleDecks[i][0] === currentBattlePlayer) {
            return gameVars.battleScreenInfo.battleDecks[i][1];
        }
    }
}

function battleWinnerText(confirmationResults) {
    if (gameVars.gameStatus.mode === "setup") {
        return "The turn order will be:\n" + confirmationResults + "\nClick Ok to Accept";
    }
    else {
        return "Confirm " + confirmationResults + "\nClick Ok to Accept";
    }
}

function battleWinnerNote(placement) {
    switch (gameVars.gameStatus.mode) {
        case "setup": return numberSuffix(placement + 1);
        case "attack": return "the winner!";
        default: console.log("battle winner note error");
    }
}

function battleConfirmationText(namesOfWinners) {
    var confirmationText = [];

    for (var i = 0; i < namesOfWinners.length; i++) {
        var textToAdd = namesOfWinners[i] + " is " + battleWinnerNote(i);

        confirmationText.push(textToAdd);
    }
    return confirmationText;
}

function battleWinnerConfirmed() {
    var orderOfWinners = gameVars.battleScreenInfo.battleWinners,
    namesOfWinners = findArrayOfPlayerNames(orderOfWinners),
    confirmationResults = battleConfirmationText(namesOfWinners),
    confirmationText = battleWinnerText(confirmationResults),
    attackWinner = Number(orderOfWinners[0]);

    if (confirm(confirmationText)) {

        switch (gameVars.gameStatus.mode) {
            case "setup":
                setupComplete();
            break;
            case "attack":
                attackChosen();
            break;
            default: console.log("battle winner error");
        }
    }
}

function resetWinners() {
    removeElement("battle-screen-toolbar", "confirm-winners");
    removeElement("battle-screen-toolbar", "reset-winners");
    for (var i = 0; i < gameVars.battleScreenInfo.battleWinners.length; i++) {
        var playerIdToRename = gameVars.battleScreenInfo.battleWinners[i],
        playerNameToRename = gameVars.playerInfo["player" + playerIdToRename].playerName,
        buttonToRename = document.getElementById("battle-winner-"+ playerIdToRename);

        buttonToRename.innerHTML = playerNameToRename;
    }
    for (var p = 1; p <= gameVars.battleScreenInfo.battlePlayersCount; p++) {
        undisableId("battle-winner-" + p);
    }
    gameVars.battleScreenInfo.battleWinners = [];
}

function showWinningButtonText(winningPlace, totalBattlePlayers) {
    switch(gameVars.gameStatus.mode) {
        case "setup":
            //winning text for initiation
            if (totalBattlePlayers === winningPlace) {
                addElement("battle-screen-toolbar", "button", "Confirm Winners", "confirm-winners", "noClass", battleWinnerConfirmed);
                return "utterly defeated";
            }
            return numberSuffix(winningPlace) + " place";
        case "attack":
            //winning text for attack mode
            addElement("battle-screen-toolbar", "button", "Cancel", "reset-winners", "noClass", resetWinners);
            addElement("battle-screen-toolbar", "button", "Confirm Winner", "confirm-winners", "noClass", battleWinnerConfirmed);
            return "the winner!";
        default: console.log("show winning button text error");
    }
}

function battleWinner(winningPlayerButton) {
    var playerId = Number(winningPlayerButton.slice(14)),
    winningPlayer = gameVars.playerInfo["player" + playerId].playerName,
    winningPlayerCount = gameVars.battleScreenInfo.battleWinners.length,
    winningPlace = winningPlayerCount + 1,
    totalBattlePlayers = gameVars.battleScreenInfo.battlePlayersCount,
    winningButtonText = winningPlayer + " is " + showWinningButtonText(winningPlace, totalBattlePlayers);

    if (gameVars.gameStatus.mode === "attack") {
        for (var i = 0; i < gameVars.battleScreenInfo.battlePlayersCount; i++) {
            disableId("battle-winner-" + gameVars.battleScreenInfo.battlePlayersCount[i]);
        }
    }
    else {
        disableId(winningPlayerButton);
    }
    gameVars.battleScreenInfo.battleWinners.push(playerId);
    winningPlayerCount = gameVars.battleScreenInfo.battleWinners.length;
    document.getElementById(winningPlayerButton).innerHTML = winningButtonText;
    //convertArrayContentToNumbers(gameVars.battleScreenInfo.battleWinners);
    if (winningPlayerCount === 1 && gameVars.gameStatus.mode === "setup") {
        addElement("battle-screen-toolbar", "button", "Cancel", "reset-winners", "noClass", resetWinners);
    }
}


function displayBattleInfo(battleDeckRef) {
    var currentPlayer = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deckPlayer,
    currentPlayerName = findPlayerName(currentPlayer),
    currentDeckName = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deckName,
    currentDeckColor = findDeckWithPlayerAndRef(currentPlayer, 0).deckColors,
    battleText = [
        currentPlayerName + " playing " + currentDeckName + " (" + currentDeckColor + ")"
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
    addElement("battle-information", "div", battleText, "battle-player" + battleDeckRef, "battle-player");
    
    //create buttons
    addElement("battle-player" + battleDeckRef, "button", currentPlayerName, "battle-winner-" + currentPlayer, "player-color-" + currentPlayer, battleWinner);

    //for each battle player show player, deck, life, cards
    for (var d = 0; d < gameMods.length; d++) {
        if (gameMods[d] !== "") {
            var gameModsCurrentText = gameMods[d][0] + gameMods[d][1]
            addElement("battle-player" + battleDeckRef, "div", gameModsCurrentText);
        }
    }
}

