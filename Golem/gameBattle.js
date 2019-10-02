


function endOfGame(winningPlayer) {
    var winningName = findPlayerName(winningPlayer);

    showIntro();

    gameVars.gameStatus.mode = "end";

    document.getElementById("intro-screen-toolbar").innerHTML = winningName + " wins!";


}

function countBattleLife(bonuses, penalties) {
    var lifeTotal = 20;

    for (var b = 0; b < bonuses.length; b++) {
        if (bonuses[b] === 0) {
            lifeTotal += adminSettings.gameBonuses[0].life;
        }
    }
    for (var p = 0; p < penalties.length; p++) {
        if (penalties[p] === 0) {
            lifeTotal += adminSettings.gamePenalties[0].life;
        }
    }
    return ["Beginning Life Total: ", lifeTotal];
}

function countBattleHand(bonuses, penalties) {
    var handTotal = 7;

    for (var b = 0; b < bonuses.length; b++) {
        if (bonuses[b] === 1) {
            handTotal += adminSettings.gameBonuses[1].hand;
        }
    }
    for (var p = 0; p < penalties.length; p++) {
        if (penalties[p] === 1) {
            handTotal += adminSettings.gamePenalties[1].hand;
        }
    }
    return ["Opening & Max Hand Size: ", handTotal];
}

function countBattlePower(bonuses, penalties) {
    var creaturePower = 0;
    
    for (var b = 0; b < bonuses.length; b++) {
        if (bonuses[b] === 2) {
            creaturePower += adminSettings.gameBonuses[2].creatureMods[0];
        }
    }
    for (var p = 0; p < penalties.length; p++) {
        if (penalties[p] === 2) {
            creaturePower += adminSettings.gamePenalties[2].creatureMods[0];
        }
    }
    if (creaturePower >= 0) {
        creaturePower = "+" + creaturePower;
    }
    return creaturePower;
}

function countBattleToughness(bonuses, penalties) {
    var creatureToughness = 0;
    
    for (var b = 0; b < bonuses.length; b++) {
        if (bonuses[b][0] === "creatureMods") {
            creatureToughness += adminSettings.gameBonuses.creatureMods[1];
        }
    }
    for (var p = 0; p < penalties.length; p++) {
        if (penalties[p][0] === "creatureMods") {
            creatureToughness += adminSettings.gamePenalties.creatureMods[1];
        }
    }
    if (creatureToughness >= 0) {
        creatureToughness = "+" + creatureToughness;
    }
    return creatureToughness;
}

function countBattlePowerAndToughness(bonuses, penalties) {
    var powerCalc = countBattlePower(bonuses, penalties),
    toughnessCalc = countBattleToughness(bonuses, penalties),
    creatureMod = powerCalc + "/" + toughnessCalc;

    if (creatureMod === "+0/+0") {
        return "";
    }
    else {
        return ["Your Creatures Get: ", creatureMod]
    }
}

function battleVanguard(battleDeckRef) {
    //future version
    return "";
}

function battleDefensePlane(battleDeckRef) {
    //future version
    return "";
}

function countCountrySupport(battleDeckRef) {
    //future version
    return "";
}

function continentBonuses(battleDeckRef) {
    //future version
    return "";
}

function battleHero(battleDeckRef) {
    //future version
    return "";
}

function battleConspiracy(battleDeckRef) {
    //future version
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
        countGames = numberSuffix(gameCount()),
        groundZero = findFullCountryWithCountry(gameVars.battleScreenInfo.groundZero).countryName;

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
        //reset map
        resetMapScreen();

        //future version
        //check if defender has a defense plane, if not go to plane chooser instead of battle

        //go to battle screen 
        showBattle();
        //update battle message and note
        document.getElementById("battle-message").innerHTML = countGames + " Battle Game for " + groundZero;
        document.getElementById("battle-note").innerHTML = "Click Winning Deck";
        //remove supply drop button
        removeElement("map-screen-toolbar", "supply-drop-button");
    }
}

function battleScreenCleanup() {
    //clear cancel and win buttons
    removeElement("battle-screen-toolbar", "reset-winners");
    removeElement("battle-screen-toolbar", "confirm-winners");
    //clear deck info and buttons
    clearBattleScreenInformation();
    //clear battle variables
    gameVars.battleScreenInfo.battlePlayersCount = [];
    gameVars.battleScreenInfo.battleDecks = [];
    gameVars.battleScreenInfo.battleWinner = [];
    gameVars.battleScreenInfo.groundZero = "";
    gameVars.battleScreenInfo.battleBonuses = [];
    gameVars.battleScreenInfo.battlePenalties = [];
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
    document.getElementById("battle-note").innerHTML = "Click order of winners for turn order";
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
    getSupplyCard(winningPlayerNumber);
}

function getSupplyCard(player) {
    if (gameVars.globalGameOptions.supplyInfo.supplyDropCardsToDraw.length === 0) {
        reshuffleSupplyDeck();
    }
    var nextSupplyCard = gameVars.globalGameOptions.supplyInfo.supplyDropCardsToDraw.pop();
    findFullPlayerWithPlayerNumber(player).playerSupplyPoints.push(nextSupplyCard);
    shuffleArray(gameVars.globalGameOptions.supplyInfo.supplyDropCardsToDraw);
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

function clearBattleScreenInformation() {
    for (var i = 0; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
        removeElement("battle-information", "battle-player" + i);
    }
}

function eliminatedPlayerCheck(winningDeck, defendingDeck) {
    //check for player eliminated and end of game
    if (winningDeck.deckPlayer !== defendingDeck.deckPlayer) {
        var defendingDeckCount = 0,
        playersInGame = [];

        for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
            if (!!gameVars.mapInfo.countryList[i].deck) {
                if (gameVars.mapInfo.countryList[i].deck.deckPlayer === defendingDeck.deckPlayer) {
                    defendingDeckCount += 1;
                }
                playersInGame.push(gameVars.mapInfo.countryList[i].deck.deckPlayer);
            }
            playersInGame = findUniqueValuesInArray(playersInGame);
        }
        if (defendingDeckCount === 0) {
            //check for end of game
            if (playersInGame.length === 1) {
                //end of game
                endOfGame(winningDeck.deckPlayer);
            }
            //player eliminated
            //transfer supply
            supplyCardsFromTo(defendingDeck.deckPlayer, winningDeck.deckPlayer);
            //remove from turn and count
            removeFromTurnOrder(defendingDeck.deckPlayer);
        }
    }
}

function removeFromTurnOrder(player) {
    for (var i = 0; i < gameVars.gameStatus.turnOrder.length; i++) {
        if (gameVars.gameStatus.turnOrder[i] === player) {
            gameVars.gameStatus.turnOrder.splice([i], 1);
        }
    }
}

function supplyCardsFromTo(playerFrom, playerTo) {
    for (var i = 0; i < gameVars.playerInfo["player" + playerFrom].playerSupplyPoints.length; i++) {
        var supplyToMove = gameVars.playerInfo["player" + playerFrom].playerSupplyPoints.splice([i], 1);

        gameVars.playerInfo["player" + playerTo].playerSupplyPoints.push(supplyToMove[0]);
    }
}

function battleWinner(winningPlayerButton) {
    var winningPlayerId = Number(winningPlayerButton.slice(14)),
    winningPlayerName = gameVars.playerInfo["player" + winningPlayerId].playerName,
    totalBattlePlayers = gameVars.battleScreenInfo.battlePlayersCount;

    if (gameVars.gameStatus.mode === "attack") {
        var winnerConfirmed = confirm(winningPlayerName + " wins!");

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
            logTempNote.push(winningPlayerName + " playing " + winningDeck.deckName + " won");
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
            clearBattleScreenInformation();
            //log end of battle
            logNote = ["Battle Game Complete"];
            logNote.push(logTempNote);
            updateLog(logNote);
            //if attacker wins
            if (winnerDesignation === "attackerWins") {
                //change mode to move
                setToMove();
            }
            //clear game variables and go to map
            gameVars.battleScreenInfo.battleDecks = [];
            gameVars.battleScreenInfo.battlePlayersCount = 0;
            gameVars.battleScreenInfo.battleWinner = [];
            gameVars.battleScreenInfo.groundZero = "";
            gameVars.battleScreenInfo.battleBonuses = [];
            gameVars.battleScreenInfo.battlePenalties = [];
            showMap();
            buildMapButtons();
            if (winningPlayerId !== gameVars.gameStatus.turn) {  
                earthShakingEventCheck();
            }
            //check for player eliminated and end of game
            eliminatedPlayerCheck(winningDeck, battleDefender);
        }
    }
    //if mode is setup
    else {
        var  winningPlayerCount = gameVars.battleScreenInfo.battleWinner.length,
        winningPlace = winningPlayerCount + 1,
        winningButtonText = winningPlayerName + " is " + showWinningButtonText(winningPlace, totalBattlePlayers);

        disableId(winningPlayerButton);
        gameVars.battleScreenInfo.battleWinner.push(winningPlayerId);
        winningPlayerCount = gameVars.battleScreenInfo.battleWinner.length;
        document.getElementById(winningPlayerButton).innerHTML = winningButtonText;
        if (winningPlayerCount === 1) {
            addElement("battle-screen-toolbar", "button", "Cancel", "reset-winners", "noClass", resetWinners);
            document.getElementById("battle-note").innerHTML = winningPlayerName + " goes first";
        }
        else {
            if (winningPlayerCount === gameVars.globalGameOptions.totalPlayers) {
                document.getElementById("battle-note").innerHTML += ", " + winningPlayerName + " goes last.";
            }
            else {
                document.getElementById("battle-note").innerHTML += ", " + winningPlayerName + " goes " + numberSuffix(winningPlayerCount);
            }
        }
    }
}

function findDeckPenalties(deckPlayer, deckName) {
    if (gameVars.gameStatus.mode === "setup") {
        return [];
    }
    else {
        var deckRef = findDeckRef(deckPlayer, deckName),
        penaltyCount = gameVars.playerInfo["player" + deckPlayer].playerDecklist[deckRef].deckPenalties,
        penaltyList = [];

        for (var i = 0; i < penaltyCount; i++) {
            var currentPenaltyRoll = getRandomInt(adminSettings.gamePenalties.length);

            penaltyList.push(currentPenaltyRoll);
        }
        //push penalty total to battle screen info
        gameVars.battleScreenInfo.battlePenalties.push(penaltyList);
        return penaltyList;
    }
}

function findDeckBonuses(deckPlayer, deckName) {
    if (gameVars.gameStatus.mode === "setup") {
        return [];
    }
    else {
        var deckRef = findDeckRef(deckPlayer, deckName),
        bonusCount = gameVars.playerInfo["player" + deckPlayer].playerDecklist[deckRef].deckBonuses,
        bonusList = [];
    
        for (var i = 0; i < bonusCount; i++) {
            var currentBonusRoll = getRandomInt(adminSettings.gameBonuses.length);
    
            bonusList.push(currentBonusRoll);
        }
        //push bonus total to battle screen info
        gameVars.battleScreenInfo.battleBonuses.push(bonusList);
        return bonusList;
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
    penalties = findDeckPenalties(currentPlayer, currentDeckName),
    bonuses = findDeckBonuses(currentPlayer, currentDeckName),
    gameMods = [
        countBattleLife(bonuses, penalties),
        countBattleHand(bonuses, penalties),
        countBattlePowerAndToughness(bonuses, penalties),
        battleVanguard(battleDeckRef),
        battleDefensePlane(battleDeckRef),
        countCountrySupport(battleDeckRef),
        continentBonuses(battleDeckRef),
        battleHero(battleDeckRef),
        battleConspiracy(battleDeckRef)
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