




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
    var attackChoiceConfirmed = confirm("Confirm Attack?"),
    countGames = numberSuffix(gameCount());

    if (attackChoiceConfirmed) {
        //update battle deck information
        gameVars.battleScreenInfo.battleDecks = gameVars.mapInfo.mapSelect;
    
        //update battle players count
        gameVars.battleScreenInfo.battlePlayersCount = gameVars.battleScreenInfo.battleDecks.length;

        //load battle screen info
        for (var j = 0; j < gameVars.battleScreenInfo.battlePlayersCount; j++) {
            displayBattleInfo(j);
        }

        //update log
        updateLog([countGames + " Game Begins"]);
    

        //future version
        //check if defender has a defense plane, if not go to plane chooser instead of battle

        //go to battle screen 
        showBattle();

        //update battle message and note
        document.getElementById("battle-message").innerHTML = countGames + " Battle Game";
        document.getElementById("battle-note").innerHTML = "Click Winning Deck";
    }
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
    gameVars.battleScreenInfo.battleWinner = [];
    gameVars.battleScreenInfo.groundZero = "";
}

function findBattleDeckNameWithPlayer(currentBattlePlayer) {
    for (var i = 0; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
        if (gameVars.battleScreenInfo.battleDecks[i].deckPlayer === currentBattlePlayer) {
            var battleDeckName = gameVars.battleScreenInfo.battleDecks[i].deckName;
            
            return battleDeckName;
        }
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
    var orderOfWinners = gameVars.battleScreenInfo.battleWinner,
    namesOfWinners = findArrayOfPlayerNames(orderOfWinners),
    confirmationResults = battleConfirmationText(namesOfWinners),
    confirmationText = "The turn order will be:\n" + confirmationResults + "\nClick Ok to Accept";

    if (confirm(confirmationText)) {
        setupComplete();
    }
}

function resetWinners() {
    removeElement("battle-screen-toolbar", "confirm-winners");
    removeElement("battle-screen-toolbar", "reset-winners");
    for (var i = 0; i < gameVars.battleScreenInfo.battleWinner.length; i++) {
        var playerIdToRename = gameVars.battleScreenInfo.battleWinner[i],
        playerNameToRename = gameVars.playerInfo["player" + playerIdToRename].playerName,
        buttonToRename = document.getElementById("battle-winner-"+ playerIdToRename);

        buttonToRename.innerHTML = playerNameToRename;
    }
    for (var p = 1; p <= gameVars.battleScreenInfo.battlePlayersCount; p++) {
        undisableId("battle-winner-" + p);
    }
    gameVars.battleScreenInfo.battleWinner = [];
}

function showWinningButtonText(winningPlace, totalBattlePlayers) {
    //winning text for initiation
    if (totalBattlePlayers === winningPlace) {
        addElement("battle-screen-toolbar", "button", "Confirm Winners", "confirm-winners", "noClass", battleWinnerConfirmed);
        return "utterly defeated";
    }
    return numberSuffix(winningPlace) + " place";
}

function findLosingDecksNotDefender(winnerPlayerNumber) {
    var defenderPlayerNumber = [gameVars.battleScreenInfo.battleDecks[1].deckPlayer],
    decksToReturn = [];

    for (var i = 0; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
        if (gameVars.battleScreenInfo.battleDecks[i].deckPlayer !== defenderPlayerNumber && gameVars.battleScreenInfo.battleDecks[i].deckPlayer !== winnerPlayerNumber) {
            decksToReturn.push(gameVars.battleScreenInfo.battleDecks[i]);
        }
    }
    return decksToReturn;
}

function findWinningPlayerDesignation(winningPlayer) {
    if (gameVars.battleScreenInfo.battleDecks[0].deckPlayer === winningPlayer) {
        return "attacker";
    }
    else if (gameVars.battleScreenInfo.battleDecks[1].deckPlayer === winningPlayer) {
        return "defender";
    }
    else {
        return "joiner";
    }
}

function battleWinner(winningPlayerButton) {
    var winningPlayerId = Number(winningPlayerButton.slice(14)),
    winningPlayerName = gameVars.playerInfo["player" + winningPlayerId].playerName,
    totalBattlePlayers = gameVars.battleScreenInfo.battlePlayersCount;

    if (gameVars.gameStatus.mode === "attack") {
        var winnerConfirmed = confirm("Confirm Game Winner");

        if (winnerConfirmed) {
            var battleDefender = gameVars.battleScreenInfo.battleDecks[1],
            battleAttacker = gameVars.battleScreenInfo.battleDecks[0],
            battleJoiners = [],
            winningDeck = {deckPlayer: winningPlayerId, deckName: findBattleDeckNameWithPlayer(winningPlayerId)},
            winningDeckName = winningDeck.deckName,
            winningFullDeck = findFullDeckWithPlayerAndName(winningPlayerId, winningDeckName),
            decksToGetPenalties = findLosingDecksNotDefender(winningPlayerId),
            winnerDesignation = findWinningPlayerDesignation(winningPlayerId),
            logTempNote = [],
            logNote = [];

            if (gameVars.battleScreenInfo.battleDecks.length > 2) {
                for (var i = 2; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
                    battleJoiners.push(gameVars.battleScreenInfo.battleDecks[i]);
                }
            }

            //all
            //update battle winners
            gameVars.battleScreenInfo.battleWinner.push(winningDeck);

            //record winner in deck notes
            winningFullDeck.deckWins += 1;
            logTempNote += winningPlayerName + " playing " + findBattleDeckNameWithPlayer(winningPlayerId) + " won, ";

            //record non defending losers in deck notes
            for (var i = 0; i < decksToGetPenalties.length; i++) {
                var currentLosingFullDeck = findFullDeckWithPlayerAndName(decksToGetPenalties[i].deckPlayer, decksToGetPenalties[i].deckName);
            
                currentLosingFullDeck.deckPenalties += 1;
                logTempNote += findPlayerName(decksToGetPenalties[i].deckPlayer) + " playing " + decksToGetPenalties[i].deckName + " lost, ";
            }



            //find winning player attack/defend/join designation

            //log end of battle

            //switch to outcome
            



            //if defender wins
            //clear game variables and go to map
            //be sure  previous attack is not able to attack
            //all other decks get penatlies

            //if joiner wins
            //defender deck is eliminated and all other decks get penatlies
            //mark defender as losing in deck notes
            //winner gets a supply drop card
            //clear country deck on ground zero and move winner to that country(and clear from previous)
            //clear game variables and go to map

            //if attacker wins 
            //defender deck is eliminated and all other decks get penatlies
            //mark defender as losing in deck notes
            //winner gets a supply drop card
            //clear country deck on ground zero and move winner to that country(and clear from previous)
            //change mode to move
            //clear game variables and go to map
    
    
            
            console.log(winningPlayerButton + " is the winner");
            console.log("winner is " + winningPlayerName);
            console.log("defender is " + battleDefender);
            console.log("attacker is " + battleAttacker);
            console.log("battle joiners are " + battleJoiners);
    
        }


    }
    else {
        var  winningPlayerCount = gameVars.battleScreenInfo.battleWinner.length,
        winningPlace = winningPlayerCount + 1,
        winningButtonText = winningPlayerName + " is " + showWinningButtonText(winningPlace, totalBattlePlayers);

        disableId(winningPlayerButton);
        gameVars.battleScreenInfo.battleWinner.push(winningPlayerId);
        winningPlayerCount = gameVars.battleScreenInfo.battleWinner.length;
        document.getElementById(winningPlayerButton).innerHTML = winningButtonText;
        if (winningPlayerCount === 1 && gameVars.gameStatus.mode === "setup") {
            addElement("battle-screen-toolbar", "button", "Cancel", "reset-winners", "noClass", resetWinners);
        }
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

