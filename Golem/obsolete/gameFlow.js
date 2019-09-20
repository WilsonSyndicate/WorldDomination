

function buildSupplyPointPool() {
    var supplyPointType = 1;

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        gameVars.gameStatus.availableSupplyPoints.push([supplyPointType, gameVars.mapInfo.countryList[i].country]);
        if (supplyPointType === gameVars.globalGameOptions.numberOfSupplyPointTypes) {
            supplyPointType = 1;
        }
        else {
            supplyPointType += 1;
        }
    }
    for (var s = 0; s < gameVars.globalGameOptions.numberOfRandomSupplyPoints; s++) {
        gameVars.gameStatus.availableSupplyPoints.push(["wild"]);
    }
    shuffleArray(gameVars.gameStatus.availableSupplyPoints);
}

function setupCleanup() {
    cleanupPlayerDeckLists();
    buildSupplyPointPool();
}

function settopOfTurn() {
    var currentPlayerId = gameVars.gameStatus.turn,
    currentPlayerName = gameVars.playerInfo["Player" + currentPlayerId].name;

    if (gameVars.gameStatus.mode === "setup" || gameVars.gameStatus.mode === "placement") {
        setupCleanup();
    }
    gameVars.gameStatus.focus = "map";
    gameVars.gameStatus.mode = "attack";
    document.getElementById("map-message").innerHTML = currentPlayerName + " Choose Attack";
    document.getElementById("map-note").innerHTML = getMapNote();
    addElement("map-message", "button", "Cancel Attack", "cancel-attack", "map-button", forfeitAttack);
}

function countPossibleAttacks() {
    var currentPlayerId = gameVars.gameStatus.turn,
    currentPlayerCountriesOnMap = [],
    currentPlayerBorders = [],
    enemyCountriesOnMap = [],
    possibleAttacks = [];

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        //add current player decks on map
        if (!!gameVars.mapInfo.countryList[i].deck && 
        gameVars.mapInfo.countryList[i].deck.player === currentPlayerId) {
            currentPlayerCountriesOnMap.push(gameVars.mapInfo.countryList[i].country);
        }
        //add enemy decks on map
        if (!!gameVars.mapInfo.countryList[i].deck && 
        gameVars.mapInfo.countryList[i].deck.player !== currentPlayerId) {
            enemyCountriesOnMap.push(gameVars.mapInfo.countryList[i].country);
        }
    }
    //list border countries
    for (var e = 0; e < currentPlayerCountriesOnMap.length; e++) {
        var currentCountryId = findCountryRef(currentPlayerCountriesOnMap[e]),
        currentCountry = gameVars.mapInfo.countryList[currentCountryId];
        
        for (var b = 0; b < currentCountry.borders.length; b++) {
            var currentBorder = currentCountry.borders[b];

            currentPlayerBorders.push(currentBorder);
        }
    }
    //unique border countries
    currentPlayerBorders = removeDuplicatesInArray(currentPlayerBorders);
    //add up possible attacks
    for (var p = 0; p < currentPlayerBorders.length; p++) {
        for (e = 0; e < enemyCountriesOnMap.length; e++) {
            if (currentPlayerBorders[p] === enemyCountriesOnMap[e]) {
                possibleAttacks.push(enemyCountriesOnMap[e]);
            }
        }
    }
    for (var q = 0; q < possibleAttacks.length; q++) {
        gameVars.battleScreenInfo.possibleAttacks.push(gameVars.mapInfo.countryList[findCountryRef(possibleAttacks[q])]);
    }
    for (var r = 0; r < currentPlayerCountriesOnMap.length; r++) {
        gameVars.battleScreenInfo.currentPlayerCountries.push(gameVars.mapInfo.countryList[findCountryRef(currentPlayerCountriesOnMap[r])]);
    }
    if (possibleAttacks.length === 0) {
        earthShakingEvent();
    }
    return possibleAttacks.length;
}






//map

function chooseAttackCountry(country) {
    var isAttackableRange = false,
    samePlayer = false,
    possibleAttacks = [];

    //disable attack join threats
    clearAllMapBorders();
    gameVars.battleScreenInfo.confirmedJoiner = [];
    if (gameVars.mapInfo.countryList[findCountryRef(country)].deck) {
        gameVars.mapInfo.mapSelect2 = gameVars.mapInfo.mapSelect1;
        gameVars.mapInfo.mapSelect1 = country;
        possibleAttacks = gameVars.mapInfo.countryList[findCountryRef(country)].borders;

        //checks for same player
        if (findCountryPlayer(country) === findCountryPlayer(gameVars.mapInfo.mapSelect2)) {
            samePlayer = true;
        }
        else {
            samePlayer = false;
        }

        //checks for attackable range
        for (var i = 0; i < possibleAttacks.length; i++) {
            if (possibleAttacks[i] === gameVars.mapInfo.mapSelect2) {
                isAttackableRange = true;
                break;
            }
            else {
                isAttackableRange = false;
            }
        }

        //action to take
        if (samePlayer === true) {
            //same player
            gameVars.mapInfo.mapSelect2 = "";
            gameVars.mapInfo.mapSelect1 = country;
            removeElement("map-message", "confirm-attack");
            updateMapNote(country);
        }
        else {
            if (isAttackableRange === true) {
                if (gameVars.gameStatus.turn === findCountryPlayer(gameVars.mapInfo.mapSelect1) || 
                 gameVars.gameStatus.turn === findCountryPlayer(gameVars.mapInfo.mapSelect2)) {
                    //attackable and in range and one of selected countries is current turn player
                    updateMapNote(country + " vs " + gameVars.mapInfo.mapSelect2);
                    removeElement("map-message", "confirm-attack");
                    addElement("map-message", "button", adminSettings.buttonText.confirmAttack, "confirm-attack", "map-button", confirmAttack);
                    highlightJoinThreat();
                }
                else {
                    gameVars.mapInfo.mapSelect2 = "";
                    gameVars.mapInfo.mapSelect1 = country;
                    removeElement("map-message", "confirm-attack");
                    updateMapNote(country);
                }
            }
            else {
                //Out of range
                gameVars.mapInfo.mapSelect2 = "";
                gameVars.mapInfo.mapSelect1 = country;
                removeElement("map-message", "confirm-attack");
                updateMapNote(country);
            }
        }
    }
    else {
        gameVars.mapInfo.mapSelect2 = "";
        gameVars.mapInfo.mapSelect1 = "";
        updateMapNote(country);
    }
    //highlight enemies
    if (gameVars.mapInfo.mapSelect2 === "") {
        highlightEnemies(gameVars.mapInfo.countryList[findCountryRef(country)])
    }
    highlightMapSelect(country);
}

function chooseJoiner(country) {
    var countryPlayer = findCountryPlayer(country),
    newPossibleJoinAttackList = [];

    gameVars.battleScreenInfo.confirmedJoiner.push(country);
    addClass(country, 'map-select');
    
    for (var i = 0; i < gameVars.battleScreenInfo.possibleJoinAttack.length; i++) {
        if (countryPlayer === findCountryPlayer(gameVars.battleScreenInfo.possibleJoinAttack[i])) {
            removeClass(gameVars.battleScreenInfo.possibleJoinAttack[i], 'join-threat');
        }
        else {
            newPossibleJoinAttackList.push(gameVars.battleScreenInfo.possibleJoinAttack[i]);
        }
    }
    gameVars.battleScreenInfo.possibleJoinAttack = newPossibleJoinAttackList;
}

function highlightMapSelect(country) {
    addClass(country, 'map-select');
}

function highlightJoinThreat() {
    var attackingCountry = findAttackingCountry(),
    attackingPlayer = findCountryPlayer(attackingCountry),
    defendingCountry = findDefendingCountry(),
    defendingPlayer = findCountryPlayer(defendingCountry),
    nonBattleParticipants = [],
    defendingBorders = findCountryBorders(defendingCountry);


    for (var i = 0; i < gameVars.gameStatus.turnOrder.length; i++) {
        if (gameVars.gameStatus.turnOrder[i] !== attackingPlayer && gameVars.gameStatus.turnOrder[i] !== defendingPlayer) {
            nonBattleParticipants.push(gameVars.gameStatus.turnOrder[i]);
        }
    }
    for (var c = 0; c < defendingBorders.length; c++) {
        for (var p = 0; p < nonBattleParticipants.length; p++) {
            if (findCountryPlayer(defendingBorders[c]) === nonBattleParticipants[p]) {
                addClass(defendingBorders[c], 'join-threat');
                undisableId(defendingBorders[c]);
                gameVars.battleScreenInfo.possibleJoinAttack.push(defendingBorders[c]);
            }
        }
    }
    addClass(defendingCountry, 'map-select');
    addClass(attackingCountry, 'map-select');
}

function highlightEnemies(country) {
    var countryPlayer = country.deck.player,
    currentPlayer = gameVars.gameStatus.turn;

    for (var j = 0; j < country.borders.length; j++) {
        var currentBorderCountry = gameVars.mapInfo.countryList[findCountryRef(country.borders[j])];

        //if counrty player is not current player highlight borders that are current player
        if (countryPlayer !== currentPlayer) {
            if (!!currentBorderCountry.deck && currentBorderCountry.deck.player === currentPlayer) {  
                addClass(country.borders[j], "attack-threat");
            }     
        }

        //if coountry player is current player highlight all borders of other players
        else {
            if (!!currentBorderCountry.deck && currentBorderCountry.deck.player !== countryPlayer) {  
                addClass(country.borders[j], "attack-threat");
            }        
        }
    }
}

function clearAllMapBorders() {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        removeClass(gameVars.mapInfo.countryList[i].country, "attack-threat");
        removeClass(gameVars.mapInfo.countryList[i].country, "join-threat");
        removeClass(gameVars.mapInfo.countryList[i].country, "map-select");

        gameVars.battleScreenInfo.possibleJoinAttack = [];
    }
}

function attackConfirmationText() {
    var attackingCountry = findAttackingCountry(),
    attackingDeck = findCountryDeck(attackingCountry),
    defendingCountry = findDefendingCountry(),
    defendingDeck = findCountryDeck(defendingCountry),
    confirmationBattleText = "Confirm " + displayCountryGUI(defendingCountry) + 
     " to be attacked by " + displayCountryGUI(attackingCountry);

    //maybe remove this
    gameVars.battleScreenInfo.battleDecks = [];
    
    gameVars.battleScreenInfo.battleDecks.push(attackingDeck);
    gameVars.battleScreenInfo.battleDecks.push(defendingDeck);
    if (gameVars.battleScreenInfo.confirmedJoiner.length > 0) {
        for (var i = 0; i < gameVars.battleScreenInfo.confirmedJoiner.length; i++) {
            var currentDeckToAdd = findCountryDeck(gameVars.battleScreenInfo.confirmedJoiner[i]);
            gameVars.battleScreenInfo.battleDecks.push(currentDeckToAdd);
            
            if (currentDeckToAdd === gameVars.battleScreenInfo.confirmedJoiner[0]) {
                confirmationBattleText += " joined by " + displayCountryGUI(gameVars.battleScreenInfo.confirmedJoiner[i]);
            }
            else {
                confirmationBattleText += " and " + displayCountryGUI(gameVars.battleScreenInfo.confirmedJoiner[i]);
            }
        }
    }
    confirmationBattleText += "?";
    addBattleScreenPlayers(gameVars.battleScreenInfo.battleDecks);
    return confirmationBattleText;
}

function addBattleScreenPlayers(battleDecks) {
    gameVars.battleScreenInfo.playersInBattleCount = [];

    for (var i = 0; i < battleDecks.length; i++) {
        var currentPlayerNumber = battleDecks[i].player;

        gameVars.battleScreenInfo.playersInBattleCount.push(currentPlayerNumber);
    }
}

function confirmAttack() {
    var attackConfirmed = confirm(attackConfirmationText());

    if (attackConfirmed === true) {
        hideId("map-screen");
        unhideId("battle-screen");
        openBattleScreen();
    }
}

function updateMapNote(message) {
    document.getElementById("map-note").innerHTML = message;
}

function getMapNote() {
    var possibleAttacks = countPossibleAttacks();

    if (possibleAttacks === 1) {
        return "This is your last possible attack"
    }
    else {
        return "You have " + possibleAttacks + " possible attacks"
    }
}





function findAttackPlayerDeckRef(playerNumber) {
    for (var i = 0; i < gameVars.battleScreenInfo.tempDeckInfo.length; i++) {
        if (gameVars.battleScreenInfo.tempDeckInfo[i].player === playerNumber) {
            return findDeckRef(playerNumber, gameVars.battleScreenInfo.tempDeckInfo[i].deckName, "random")
        }
    }
}

function deckChooser(plyrNum) {
    switch(gameVars.gameStatus.mode) {
        case "setup":
                return gameVars.playerInfo["Player" + plyrNum].gameDeckRandomLibrary[0];
        case "attack":
            return gameVars.playerInfo["Player" + plyrNum].gameDeckRandomLibrary[findAttackPlayerDeckRef(plyrNum)];
        default:
            console.log("deck chooser error");
    }




    //tally all bonuses and penalties



}

function BattleDeck(deck, player) {
    this.player = player;
    this.deck = deck;
}

function setupBattleInfo() {
    var decksInGame = gameVars.battleScreenInfo.playersInBattleCount;

    if (gameVars.gameStatus.mode === "attack") {
        gameVars.battleScreenInfo.tempDeckInfo = [];
        gameVars.battleScreenInfo.tempDeckInfo = gameVars.battleScreenInfo.battleDecks;
        gameVars.battleScreenInfo.battleDecks = [];
    }

    for (var i = 0; i < decksInGame.length; i++) {
        var battleDeck = new BattleDeck(deckChooser(decksInGame[i]), decksInGame[i]);

        gameVars.battleScreenInfo.battleDecks.push(battleDeck);
    }
}

function openBattleScreen() {
    var battleParticipants = gameVars.battleScreenInfo.battleDecks;  

    setupBattleInfo();
    if (gameVars.gameStatus.mode === "setup") {
        updateBattleLog("Initiation Game Begins");
    }
    else {
        updateBattleLog(numberSuffix(countPreviousGames() + 1) + " Battle Game Begins");
    }
    for (var i = battleParticipants.length - 1; i >= 0; i--) {
        displayBattleInfo(i);
    }
}

//Battle winner Confirmed




function joinerGamePlayers() {
    var joinerPlayers = [];

    if (gameVars.battleScreenInfo.battleDecks.length > 2) {
        for (var i = 2; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
            joinerPlayers.push(gameVars.battleScreenInfo.battleDecks[i].player);
        }      
    }
    return joinerPlayers;
}

function joinerGameDecks() {
    var joinerDecks = [];

    if (gameVars.battleScreenInfo.battleDecks.length > 2) {
        for (var i = 2; i < gameVars.battleScreenInfo.battleDecks.length; i++) {
            joinerDecks.push(gameVars.battleScreenInfo.battleDecks[i].deck.deckName);
        }      
    }
    return joinerDecks;
}

function endOfAttack() {
    gameVars.gameStatus.mode = "move";
    removeElement("map-message", "cancel-attack");

    //remove all highlights
    //lock only enemy countries by running map colors and highlights

    //change map message to move

    //change map note





    
    console.log("changed mode to move");
}

function forfeitAttack() {
    var confirmEndOfAttack = confirm("Forfeit additional attacks and go to move?");

    if (confirmEndOfAttack === true) {
        endOfAttack();
    }
}

function attackWinnerConfirmed(winningPlayerNumber) {
    var attackingPlayerNumber = gameVars.battleScreenInfo.battleDecks[0].player,
    attackingDeckName = gameVars.battleScreenInfo.battleDecks[0].deck.deckName,
    defendingPlayerNumber = gameVars.battleScreenInfo.battleDecks[1].player,
    defendingDeckName = gameVars.battleScreenInfo.battleDecks[1].deck.deckName,
    joinerPlayerNumbers = joinerGamePlayers(),
    joinerDecks = joinerGameDecks(),
    groundZero = findDefendingCountry()
    winningDeckName = findDeckNameWithPlayer(winningPlayerNumber);



    //needs to log end of battle






    switch (winningPlayerNumber) {//break this down into functions
        case attackingPlayerNumber://attacker wins
            //defending deck eliminated
            battleConsequenceEliminated(defendingPlayerNumber, defendingDeckName);
            //joiner decks get penalty
            for (var i = 0; i < joinerDecks.length; i++) {
                battleConsequencePenalty(joinerPlayerNumbers[i], joinerDecks[i]);
            }
            //winner gets risk card
            getSupplyPoint(winningPlayerNumber);
            //attacker deck moves to defending country
            deckMovesTo(winningPlayerNumber, winningDeckName, groundZero);
            
            //log battle

            battleCleanup();
            endOfAttack();
        break;
        case defendingPlayerNumber://defender wins
            //attacking deck get penalties
            battleConsequencePenalty(attackingPlayerNumber, attackingDeckName);
            //joiner decks get penalty
            for (var i = 0; i < joinerDecks.length; i++) {
                battleConsequencePenalty(joinerPlayerNumbers[i], joinerDecks[i]);
            }
            //attacking country button locked
            gameVars.battleScreenInfo.alreadyAttacked.push(findAttackingCountry());

            //log battle

            battleCleanup();
            //check for end of attack
            if (countPossibleAttacks() === 0) {
                endOfAttack();
            }
            else {
                refreshMapButtonColors();
            }
        break;
        default://joiner wins
            //defending deck dies
            battleConsequenceEliminated(defendingPlayerNumber, defendingDeckName);
            //attacker deck penalty
            battleConsequencePenalty(attackingPlayerNumber, attackingDeckName);
            //other joiner decks get penalty
            for (var i = 0; i < joinerDecks.length; i++) {
                if (joinerDecks[i] !== winningDeckName) {
                    battleConsequencePenalty(joinerPlayerNumbers[i], joinerDecks[i]);
                }
            }
            //winner gets risk card
            getSupplyPoint(winningPlayerNumber);
            //joiner deck moves to ground zero
            deckMovesTo(winningPlayerNumber, winningDeckName, groundZero);
            //attacking country button locked
            gameVars.battleScreenInfo.alreadyAttacked.push(findAttackingCountry());
            
            //log battle
            
            battleCleanup();
            //check for end of attack
            if (countPossibleAttacks() === 0) {
                endOfAttack();
            }
            else {
                refreshMapButtonColors();
            }
    }
    //change focus to map
    gameVars.gameStatus.focus = "map";
    hideId("battle-screen");
    unhideId("map-screen");
}





//Battle Winners Decided


//Initiation game begins
function startIniGame() {
    if (confirm ("Save player information and start initiation game?")) {
        startIniGameConfirmed();
    }  
}

//player setup begins
function beginPlayerSetup() {
    gameVars.globalGameOptions.totalPlayers = parseInt(document.getElementById("update-player-count").value);
    if (document.getElementById("shared-deck-pool").checked === true) {
        gameVars.globalGameOptions.sharedDeckPool = true;
    } 
    else {
        gameVars.globalGameOptions.sharedDeckPool = false;
    }

    if (document.getElementById("random-map-setup").checked === true) {
        gameVars.globalGameOptions.randomMapSetup = true;
    } 
    else {
        gameVars.globalGameOptions.randomMapSetup = false;
    }
    if (confirm("Are you sure you want these options for this game?\n Total Players: " + gameVars.globalGameOptions.totalPlayers + 
    "\n Shared Deck Pool: " + tfyn(gameVars.globalGameOptions.sharedDeckPool) + 
    "\n Random Map Setup: " + tfyn(gameVars.globalGameOptions.randomMapSetup))) {
        hideId("global-game-options");
        hideId("player-earned-info");
        unhideId("player-info");
        createPlayerOptions();
        refreshPlayerSetupInformation();
    } 
}

//setup begins
document.addEventListener("DOMContentLoaded", function() { 
    var maxPlayers = Object.keys(masterDeckList).length;

    addAuthorToDecklists(maxPlayers);
    hideId("player-info");
    hideId("battle-screen");
    hideId("map-screen");
    document.getElementById("update-player-count").max = maxPlayers;
    updateLog(["Begin Setup"]);
});


