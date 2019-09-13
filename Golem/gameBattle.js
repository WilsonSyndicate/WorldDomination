




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

function updateAttackDefendJoined() {
    for (var i = 0; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
        var currentDeck = gameVars.battleScreenInfo.battleDecks[i],
        currentFullDeck = findFullDeckWithPlayerAndName(currentDeck.deckPlayer, currentDeck.deckName);

        if (i === 0) {
            currentFullDeck.deckAttacksMade += 1;
        }
        else if (i === 1) {
            currentFullDeck.deckTimesDefended += 1;
        }
        else {
            currentFullDeck.deckTimesJoined += 1;
        }
    }
}

function unhideAllBattleDecks() {
    for (var i = 0; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
        var currentDeck = gameVars.battleScreenInfo.battleDecks[i],
        currentFullDeck = findFullDeckWithPlayerAndName(currentDeck.deckPlayer, currentDeck.deckName);

        currentFullDeck.deckHidden = false;
    }
}

function attackChosen() {
    var attackChoiceConfirmed = confirm("Confirm Attack?");

    if (attackChoiceConfirmed) {
        var attackingPlayer = gameVars.mapInfo.mapSelect[0].deckPlayer,
        attackingDeckName = gameVars.mapInfo.mapSelect[0].deckName,
        countGames = numberSuffix(gameCount());

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

        //add attacking country to already attacked list
        gameVars.mapInfo.alreadyAttacked.push(findFullCountryWithDeckPlayerAndDeckName(attackingPlayer, attackingDeckName).country);

        //unhide all decks
        unhideAllBattleDecks();

        //update times attacked, defended and joined
        updateAttackDefendJoined();

        resetMapScreen();

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
    clearBattleScreenInfomration();

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
    if(gameVars.gameStatus.mode === "setup") {
        return numberSuffix(placement + 1);
    }
    else {
        return "the winner!";
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

function findLosingDecks(winnerPlayerNumber) {
    var decksToReturn = [];

    for (var i = 0; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
        if (gameVars.battleScreenInfo.battleDecks[i].deckPlayer !== winnerPlayerNumber) {
            decksToReturn.push(gameVars.battleScreenInfo.battleDecks[i]);
        }
    }
    return decksToReturn;
}

function findWinningPlayerDesignation(winningPlayer) {
    if (gameVars.battleScreenInfo.battleDecks[0].deckPlayer === winningPlayer) {
        return "attackerWins";
    }
    else if (gameVars.battleScreenInfo.battleDecks[1].deckPlayer === winningPlayer) {
        return "defenderWins";
    }
    else {
        return "joinerWins";
    }
}

function eliminateDeck(deckPlayer, deckName) {
    var deckToEliminate = findFullDeckWithPlayerAndName(deckPlayer, deckName),
    eliminatedDeckCountry = findFullCountryWithDeckPlayerAndDeckName(deckPlayer, deckName),
    winningPlayerNumber = gameVars.battleScreenInfo.battleWinner.deckPlayer,
    winningPlayerDeckName = gameVars.battleScreenInfo.battleWinner.deckName,
    winningDeckCountry = findFullCountryWithDeckPlayerAndDeckName(winningPlayerNumber, winningPlayerDeckName);
    
    //mark as eliminated
    deckToEliminate.deckEleminated = true;

    //add winner to losers country
    eliminatedDeckCountry.deck = {deckPlayer: winningPlayerNumber, deckName: winningPlayerDeckName};

    //remove winner from its country
    delete winningDeckCountry.deck;

    //winner gets a supply drop card
    findFullPlayerWithPlayerNumber(winningPlayerNumber).playerSupplyPoints += 1;

    console.log(deckToEliminate.deckName + " eliminated");
}

function markDeckAsWinner(deckPlayer, deckName) {
    var fullDeck = findFullDeckWithPlayerAndName(deckPlayer, deckName);

    gameVars.battleScreenInfo.battleWinner = {deckPlayer: deckPlayer, deckName: deckName};
    fullDeck.deckWins += 1;
    fullDeck.deckGamesPlayed += 1;

    //future version
    //get a vanguard if available
}

function markDeckAsLoser(deckPlayer, deckName, defenderPlayer) {
    var fullDeck = findFullDeckWithPlayerAndName(deckPlayer, deckName);

    if (defenderPlayer === deckPlayer) {
        eliminateDeck(deckPlayer, deckName);
        gameVars.battleScreenInfo.eliminatedDeck = {deckPlayer: deckPlayer, deckName: deckName};
    }
    else {
        fullDeck.deckPenalties += 1;
        fullDeck.deckGamesPlayed += 1;
    }
}

function clearBattleScreenInfomration() {
    for (var i = 0; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
        removeElement("battle-information", "battle-player" + i);
    }
}

function getNextTurn() {
    for (var i = 0; i < gameVars.gameStatus.turnOrder.length; i++) {
        var currentTurn = gameVars.gameStatus.turn,
        lastTurn = gameVars.gameStatus.turnOrder[gameVars.gameStatus.turnOrder.length];

        if (currentTurn === lastTurn) {
            return gameVars.gameStatus.turnOrder[0];
        }
        else {
            return gameVars.gameStatus.turnOrder[i + 1];
        }
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
            battleJoiners = [],
            winningDeck = {deckPlayer: winningPlayerId, deckName: findBattleDeckNameWithPlayer(winningPlayerId)},
            losingDecks = findLosingDecks(winningPlayerId),
            winnerDesignation = findWinningPlayerDesignation(winningPlayerId),
            logTempNote = [],
            logNote = [];

            //update joiner list
            if (gameVars.battleScreenInfo.battleDecks.length > 2) {
                for (var i = 2; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
                    battleJoiners.push(gameVars.battleScreenInfo.battleDecks[i]);
                }
            }

            //update battle winners
            markDeckAsWinner(winningDeck.deckPlayer, winningDeck.deckName);
            logTempNote.push(winningPlayerName + " playing " + winningDeck.deckName + " won")

            //update battle losers
            for (var i = 0; i < losingDecks.length; i++) {
                markDeckAsLoser(losingDecks[i].deckPlayer, losingDecks[i].deckName, battleDefender.deckPlayer);

                if (gameVars.battleScreenInfo.eliminatedDeck.deckPlayer === losingDecks[i].deckPlayer) {
                    logTempNote.push(findPlayerName(losingDecks[i].deckPlayer) + " playing " + losingDecks[i].deckName + " lost and was eliminated");
                }
                else {
                    logTempNote.push(findPlayerName(losingDecks[i].deckPlayer) + " playing " + losingDecks[i].deckName + " lost");
                }
            }

            // clear battle screen infomration
            clearBattleScreenInfomration();
            
            //log end of battle
            logNote = ["Battle Game Complete"];
            logNote.push(logTempNote);
            updateLog(logNote);
            
            if (winnerDesignation === "attackerWins") {
                //change mode to move
                setToMove();
            }

            //clear game variables and go to map
            gameVars.battleScreenInfo.battleDecks = [];
            gameVars.battleScreenInfo.battlePlayersCount = 0;
            gameVars.battleScreenInfo.battleWinner = [];
            gameVars.battleScreenInfo.groundZero = "";
            showMap();

            buildMapButtons();
            //check for earth shaking event






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

