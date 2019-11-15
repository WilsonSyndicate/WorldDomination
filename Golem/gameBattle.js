function availableVanguardCards() {
    var takenVanguardCards = [],
    availableVanguardDeck = [];

    //load takenvanguardcards
    for (var c = 0; c < gameVars.mapInfo.countryList.length; c++) {
        var currentCountry = gameVars.mapInfo.countryList[c];

        if (!!currentCountry.deck) {
            var fullDeck = findFullDeckWithPlayerAndName(currentCountry.deck.deckPlayer, currentCountry.deck.deckName);

            if (!!fullDeck.vanguardList) {
                var currentVanguardList = findFullDeckWithPlayerAndName(currentCountry.deck.deckPlayer, currentCountry.deck.deckName).vanguardList;

                for (var v = 0; v < currentVanguardList.length; v++) {
                    takenVanguardCards.push(currentVanguardList[v]);
                }
            }
        }      
    }
    //add available vanguard
    for (var v = 0; v < vanguardDeck.length; v++) {
        var currentVanguardName = vanguardDeck[v].vanguardName;

        if (!isItemInArray(currentVanguardName, takenVanguardCards)) {
            availableVanguardDeck.push(currentVanguardName)
        }
    }
    return availableVanguardDeck;
}

function getVanguard(deckPlayer, deckName) {
    var availableVanguard = availableVanguardCards();

    shuffleArray(availableVanguard);
    //take next card
    if (availableVanguard.length > 0) {
        var nextVanguard = availableVanguard[0];

        if (!findFullDeckWithPlayerAndName(deckPlayer, deckName).vanguardList) {
            findFullDeckWithPlayerAndName(deckPlayer, deckName).vanguardList = [];
        }
        findFullDeckWithPlayerAndName(deckPlayer, deckName).vanguardList.push(nextVanguard);
    }
}

function loadBattleVanguards(battleDeckRef) {
    var currentPlayer = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deckPlayer,
    currentDeckName = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deckName;

    if (!!findFullDeckWithPlayerAndName(currentPlayer, currentDeckName).vanguardList) {
        var currentVanguardList = findFullDeckWithPlayerAndName(currentPlayer, currentDeckName).vanguardList
        
        shuffleArray(currentVanguardList);
        gameVars.battleScreenInfo.battleVanguards.push(currentVanguardList[0]);
    }
    else {
        gameVars.battleScreenInfo.battleVanguards.push("noVanguard");
    }
}

function setPlayerInfoLocation() {
    var battlePlayerCount = gameVars.battleScreenInfo.battlePlayersCount;

    if (battlePlayerCount === 3) {
        document.getElementById("battle-player2").style.margin= "auto";
        document.getElementById("battle-player2").style.position= "relative";
        document.getElementById("battle-player2").style.top= "187px";
    }
    else if (battlePlayerCount > 3) {
        document.getElementById("battle-player2").style.margin= "25px";
        document.getElementById("battle-player2").style.position= "absolute";
        document.getElementById("battle-player2").style.top= "325px";
    }
}

function endOfGame(winningPlayer) {
    var winningName = findPlayerName(winningPlayer);

    showIntro();

    gameVars.gameStatus.mode = "end";

    document.getElementById("intro-screen-toolbar").innerHTML = winningName + " wins!";
}

function countBattleLife(bonuses, penalties, countrySupport, battleDeckRef) {
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
    //hero
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleHero[battleDeckRef] !== "noHero") {
        lifeTotal += findFullHeroWithName(gameVars.battleScreenInfo.battleHero[battleDeckRef]).heroLife;
    }
    //conspiracy
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleConspiracy[battleDeckRef] !== "noConspiracy") {
        lifeTotal += findFullConspiracyWithName(gameVars.battleScreenInfo.battleConspiracy[battleDeckRef]).conspiracyLife;
    }
    //vanguard
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleVanguards[battleDeckRef] !== "noVanguard") {
        var vanguardRef = findVanguardRef(gameVars.battleScreenInfo.battleVanguards[battleDeckRef]);

        lifeTotal += vanguardDeck[vanguardRef].vanguardLife;
    }
    //country support
    if (adminSettings.supportBonus.useSupportBonusInGame === true && gameVars.gameStatus.mode !== "setup") {
        if (countrySupport[1] === true) {
            lifeTotal += Math.floor(adminSettings.supportBonus.defendingLife * countrySupport[0]);
        }
        else {
            lifeTotal += Math.floor(adminSettings.supportBonus.attackingLife * countrySupport[0]);
        }
    }
    return ["Beginning Life Total: ", lifeTotal];
}

function countBattleHand(bonuses, penalties, countrySupport, battleDeckRef) {
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
    //hero
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleHero[battleDeckRef] !== "noHero") {
        handTotal += findFullHeroWithName(gameVars.battleScreenInfo.battleHero[battleDeckRef]).heroHand;
    }
    //conspiracy
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleConspiracy[battleDeckRef] !== "noConspiracy") {
        handTotal += findFullConspiracyWithName(gameVars.battleScreenInfo.battleConspiracy[battleDeckRef]).conspiracyHand;
    }
    //vanguard
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleVanguards[battleDeckRef] !== "noVanguard") {
        handTotal += vanguardDeck[findVanguardRef(gameVars.battleScreenInfo.battleVanguards[battleDeckRef])].vanguardHand;
    }
    //country support
    if (adminSettings.supportBonus.useSupportBonusInGame === true && gameVars.gameStatus.mode !== "setup") {
        if (countrySupport[1] === true) {
            handTotal += Math.floor(adminSettings.supportBonus.defendingHand * countrySupport[0]);
        }
        else {
            handTotal += Math.floor(adminSettings.supportBonus.attackingHand * countrySupport[0]);
        }
    }
    return ["Opening & Max Hand Size: ", handTotal];
}

function countBattlePower(bonuses, penalties, countrySupport, battleDeckRef) {
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
    //vanguard
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleVanguards[battleDeckRef] !== "noVanguard") {
        creaturePower += vanguardDeck[findVanguardRef(gameVars.battleScreenInfo.battleVanguards[battleDeckRef])].vanguardPower;
    }
    //country support
    if (adminSettings.supportBonus.useSupportBonusInGame === true && gameVars.gameStatus.mode !== "setup") {
        if (countrySupport[1] === true) {
            creaturePower += Math.floor(adminSettings.supportBonus.defendingPower * countrySupport[0]);
        }
        else {
            creaturePower += Math.floor(adminSettings.supportBonus.attackingPower * countrySupport[0]);
        }
    }
    if (creaturePower >= 0) {
        creaturePower = "+" + creaturePower;
    }
    return creaturePower;
}

function countBattleToughness(bonuses, penalties, countrySupport, battleDeckRef) {
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
    //vanguard
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleVanguards[battleDeckRef] !== "noVanguard") {
        creatureToughness += vanguardDeck[findVanguardRef(gameVars.battleScreenInfo.battleVanguards[battleDeckRef])].vanguardToughness;
    }
    //country support
    if (adminSettings.supportBonus.useSupportBonusInGame === true && gameVars.gameStatus.mode !== "setup") {
        if (countrySupport[1] === true) {
            creatureToughness += Math.floor(adminSettings.supportBonus.defendingToughness * countrySupport[0]);
        }
        else {
            creatureToughness += Math.floor(adminSettings.supportBonus.attackingToughness * countrySupport[0]);
        }
    }
    if (creatureToughness >= 0) {
        creatureToughness = "+" + creatureToughness;
    }
    return creatureToughness;
}

function countBattlePowerAndToughness(bonuses, penalties, countrySupport, battleDeckRef) {
    var powerCalc = countBattlePower(bonuses, penalties, countrySupport, battleDeckRef),
    toughnessCalc = countBattleToughness(bonuses, penalties, countrySupport, battleDeckRef),
    creatureMod = powerCalc + "/" + toughnessCalc;

    if (creatureMod === "+0/+0") {
        return "";
    }
    else {
        return ["Your Creatures Get: ", creatureMod]
    }
}

function battleVanguard(battleDeckRef) {
    if (gameVars.gameStatus.mode === "setup" || gameVars.battleScreenInfo.battleVanguards[battleDeckRef] === "noVanguard") {
        return "";
    }
    else {
        return ["Vanguard: ", gameVars.battleScreenInfo.battleVanguards[battleDeckRef]];
    }
}

function battleDefensePlane(battleDeckRef) {
    //future version
    return "";
}

function continentBonuses(battleDeckRef) {
    //future version
    return "";
}

function battleHero(battleDeckRef) {
    //for defense
    if (gameVars.gameStatus.mode !== "setup") {
        if (battleDeckRef === 1) {
            var currentPlayer = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deckPlayer,
            currentDeckName = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deckName,
            currentHero = findFullCountryWithDeckPlayerAndDeckName(currentPlayer, currentDeckName).hero;
    
            if (currentHero !== "") {
                gameVars.battleScreenInfo.battleHero.push(currentHero);
                return ["Hero: ", currentHero];
            }
        }
        gameVars.battleScreenInfo.battleHero.push("noHero");
    }
    return "";
}

function battleConspiracy(battleDeckRef) {
    //for attack
    if (gameVars.gameStatus.mode !== "setup") {
        if (battleDeckRef !== 1) {
            var currentPlayer = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deckPlayer,
            currentDeckName = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deckName,
            currentConspiracy = findFullCountryWithDeckPlayerAndDeckName(currentPlayer, currentDeckName).conspiracy;
    
            if (currentConspiracy !== "") {
                gameVars.battleScreenInfo.battleConspiracy.push(currentConspiracy);
                return ["Conspiracy: ", currentConspiracy];
            }
        }
        gameVars.battleScreenInfo.battleConspiracy.push("noConspiracy");
    }
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
        //display battle screen info
        for (var j = 0; j < gameVars.battleScreenInfo.battlePlayersCount; j++) {
            //load battle vanguards
            loadBattleVanguards(j);
            //load battle screen info
            displayBattleInfo(j);
        }
        //set info locations
        setPlayerInfoLocation();
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
    gameVars.battleScreenInfo.battleVanguards = [];
    gameVars.battleScreenInfo.battleHero = [];
    gameVars.battleScreenInfo.battleConspiracy = [];
    //clear deck info and buttons
    clearBattleScreenInformation();
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
        //add btn class to button
        addClass("confirm-winners", "btn");
        //add primary button class to button
        addClass("confirm-winners", "btn-primary");
        //add danger button class to button
        addClass("confirm-winners", "battle-button");
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

    //for testing
    return nextSupplyCard;
}

function markDeckAsWinner(deckPlayer, deckName) {
    var fullDeck = findFullDeckWithPlayerAndName(deckPlayer, deckName);

    gameVars.battleScreenInfo.battleWinner = {deckPlayer: deckPlayer, deckName: deckName};
    fullDeck.deckWins += 1;
    fullDeck.deckGamesPlayed += 1;
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
    for (var i = 0; i < 6; i++) {
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
            logTempNote.push(winningPlayerName + " playing " + winningDeck.deckName + " wins");
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
            //get vanguard
            if (adminSettings.useVanguard === true) {
                getVanguard(winningDeck.deckPlayer, winningDeck.deckName);
            }
            //log end of battle
            logNote = ["Battle Game Complete"];
            logNote.push(logTempNote);
            updateLog(logNote);
            //if attacker wins
            if (winnerDesignation === "attackerWins") {
                //change mode to move
                setToMove();
            }
            // clear battle screen infomration
            clearBattleScreenInformation();
            //clear game variables and go to map
            gameVars.battleScreenInfo.battleDecks = [];
            gameVars.battleScreenInfo.battlePlayersCount = 0;
            gameVars.battleScreenInfo.battleWinner = [];
            gameVars.battleScreenInfo.groundZero = "";
            gameVars.battleScreenInfo.battleBonuses = [];
            gameVars.battleScreenInfo.battlePenalties = [];
            gameVars.battleScreenInfo.battleVanguards = [];
            gameVars.battleScreenInfo.battleHero = [];
            gameVars.battleScreenInfo.battleConspiracy = [];
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
            //add btn class to button
            addClass("reset-winners", "btn");
            //add danger button class to button
            addClass("reset-winners", "btn-danger");
            //add battle button class to button
            addClass("reset-winners", "battle-button");
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

function findCountrySupport(deckPlayer) {
    if (gameVars.gameStatus.mode !== "setup") {
        var groundZer0 = gameVars.battleScreenInfo.groundZero,
        fullCountryGroundZero = findFullCountryWithCountry(groundZer0),
        borderingCountriesWithSamePlayer = 0,
        isDefender = true;
    
        for (var i = 0; i < fullCountryGroundZero.borders.length; i++) {
            if (findCountryPlayer(fullCountryGroundZero.borders[i]) === deckPlayer) {
                borderingCountriesWithSamePlayer += 1;
            }
        }
        //modify country support
        if (gameVars.battleScreenInfo.battleDecks[1].deckPlayer !== deckPlayer) {
            borderingCountriesWithSamePlayer -= 1;
            isDefender = false;
        }
        return [borderingCountriesWithSamePlayer, isDefender];
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
    countrySupport = findCountrySupport(currentPlayer),
    penalties = findDeckPenalties(currentPlayer, currentDeckName),
    bonuses = findDeckBonuses(currentPlayer, currentDeckName),
    gameMods = [
        battleVanguard(battleDeckRef),
        battleDefensePlane(battleDeckRef),
        continentBonuses(battleDeckRef),
        battleHero(battleDeckRef),
        battleConspiracy(battleDeckRef),
        countBattleLife(bonuses, penalties, countrySupport, battleDeckRef),
        countBattleHand(bonuses, penalties, countrySupport, battleDeckRef),
        countBattlePowerAndToughness(bonuses, penalties, countrySupport, battleDeckRef)
    ];

    //add player and deck name (color)
    addElement("battle-information", "h3", battleText, "battle-player" + battleDeckRef, "battle-player");
    //add player number class to deck info space
    addClass("battle-player" + battleDeckRef, "player-" + currentPlayer + "-battle-info");
    //for each battle player show player, deck, life, cards
    for (var d = 0; d < gameMods.length; d++) {
        if (gameMods[d] !== "") {
            var gameModsCurrentText = gameMods[d][0] + gameMods[d][1];

            addElement("battle-player" + battleDeckRef, "h6", gameModsCurrentText, "small");
        }
    }
    //create buttons
    addElement("battle-player" + battleDeckRef, "button", currentPlayerName, "battle-winner-" + currentPlayer, "player-color-" + currentPlayer, battleWinner);
    //add btn class to button
    addClass("battle-winner-" + currentPlayer, "btn");
    //add win-button class to button
    addClass("battle-winner-" + currentPlayer, "win-button");
}