// drop map
function returnSupplyDropCard(country) {
    var currentPlayer = gameVars.gameStatus.turn,
    currentPlayerSupply = gameVars.playerInfo["player" + currentPlayer].playerSupplyPoints;

    //find a card with corresponding country
    for (var i = 0; i < currentPlayerSupply.length; i++) {
        if (currentPlayerSupply[i].supplyCountry === country) {
            //remove it from the current player hand
            var supplyToMove = currentPlayerSupply.splice([i], 1);
            //add it to the turned in set
            gameVars.globalGameOptions.supplyInfo.supplyDropCardsTurnedIn.push(supplyToMove[0]);
        }
    }
}

function dropDeckIntoGame(player, country) {
    var fullPlayer = gameVars.playerInfo["player" + player],
    dugoutRef = fullPlayer.playerDugout,
    deckToDrop = fullPlayer.playerDecklist[dugoutRef],
    newDeckPlayer = player,
    newDeckName = deckToDrop.deckName;

    //drop deck associated with dugout
    findFullCountryWithCountry(country).deck = {deckPlayer: newDeckPlayer, deckName: newDeckName}; 
    //increase player dugout by 1
    fullPlayer.playerDugout += 1;
    //return deck name
    return newDeckName
}

function dropWildCard(card) {
    //only if queue is less than3
    if (gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length < 3) {
    //count wild cards used
    var wildCardsPlayed = countItemsInArray("none", gameVars.globalGameOptions.supplyInfo.supplyDropQueue);
    //remove button for corresponding count
    removeElement("map-screen-toolbar", card);
    //mark as chosen
    chooseSupplyDrop("none");
    }
}

function reshuffleSupplyDeck() {
    //move each turned in supply to supply to draw
    for (var i = 0; i < gameVars.globalGameOptions.supplyInfo.supplyDropCardsTurnedIn.length; i++) {
        var supplyToMove = gameVars.globalGameOptions.supplyInfo.supplyDropCardsTurnedIn.splice([i], 1);

        gameVars.globalGameOptions.supplyInfo.supplyDropCardsToDraw.push(supplyToMove[0]);
    }
    //shuffle cards to draw
    shuffleArray(gameVars.globalGameOptions.supplyInfo.supplyDropCardsToDraw);
}

function makeSupplyDrop() {
    var supplyDropConfirmation = confirm("Supply Drop to These Countries?");

    if (supplyDropConfirmation) {
        //do this for each country in queue
        for (var i = 0; i < gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length; i++) {
            var country = gameVars.globalGameOptions.supplyInfo.supplyDropQueue[i],
            currentPlayerName = findPlayerName(gameVars.gameStatus.turn),
            logText = "Supply Drop by " + currentPlayerName,
            fullCountry = findFullCountryWithCountry(country);
            
            //wild drop
            if (country === "none") {
                logText += " Wild Card Dropped";
            }
            else {
                //country drop
                if (!!fullCountry.deck) {
                    logText += " on " + fullCountry.countryName;
                    if (gameVars.gameStatus.turn === fullCountry.deck.deckPlayer) {
                        //drop 2 bonuses
                        findFullDeckWithPlayerAndName(fullCountry.deck.deckPlayer, fullCountry.deck.deckName).deckBonuses += 2;
                        //add log text
                        logText += ": 2 bonuses for " + findPlayerName(fullCountry.deck.deckPlayer) + "'s " + fullCountry.deck.deckName;
                    }
                    else {
                        //drop 2 penalties
                        findFullDeckWithPlayerAndName(fullCountry.deck.deckPlayer, fullCountry.deck.deckName).deckPenalties += 2;
                        //add log text
                        logText += ": 2 penalties for " + findPlayerName(fullCountry.deck.deckPlayer) + "'s " + fullCountry.deck.deckName;
                    }
                }
                else {
                    //drop deck
                    var newDeckName = dropDeckIntoGame(gameVars.gameStatus.turn, country);
                    //add log text
                    logText += ": " + findPlayerName(fullCountry.deck.deckPlayer) + " drops " + newDeckName + " into game";
                }
                //border drop
                for (var b = 0; b < fullCountry.borders.length; b++) {
                    var borderFullCountry = findFullCountryWithCountry(fullCountry.borders[b]);

                    if (!!borderFullCountry.deck) {
                        if (gameVars.gameStatus.turn === borderFullCountry.deck.deckPlayer) {
                            //drop bonus
                            findFullDeckWithPlayerAndName(fullCountry.deck.deckPlayer, fullCountry.deck.deckName).deckBonuses += 1;
                            //add log text
                            logText += ": 1 bonus for " + findPlayerName(borderFullCountry.deck.deckPlayer) + "'s " + borderFullCountry.deck.deckName;
                        }
                        else {
                            //drop penalty
                            findFullDeckWithPlayerAndName(fullCountry.deck.deckPlayer, fullCountry.deck.deckName).deckPenalties += 1;
                            //add log text
                            logText += ": 1 penalty for " + findPlayerName(borderFullCountry.deck.deckPlayer) + "'s " + borderFullCountry.deck.deckName;
                        }
                    }
                }
            }
            //put supply card in supplyDropCardsTurnedIn
            returnSupplyDropCard(country);

            //update Log
            updateLog([logText]);
        }
        //clear drop
        clearDropSelect();
        //remove drop buttons
        removeElement("map-screen-toolbar", "drop-select-cancel");
        removeElement("map-screen-toolbar", "make-drop");
        removeAllWildCardButtons();
        //change mode
        gameVars.gameStatus.mode = "attack";
        //go back to choose attack
        beginAttack();
        //alert user
        alert("Supply Drop Finished, proceed to Attack");
    }
}

function removeAllWildCardButtons() {
    removeElement("map-screen-toolbar", "wild-drop0");
    removeElement("map-screen-toolbar", "wild-drop1");
}


function maxSupplyCheck() {
    var currentTurn = gameVars.gameStatus.turn,
    currentPlayerSupplyCount = gameVars.playerInfo["player" + currentTurn].playerSupplyPoints.length;

    if (currentPlayerSupplyCount >= gameVars.globalGameOptions.supplyInfo.maxSupplyPerPerson) {
        //change button note
        document.getElementById("drop-select-cancel").innerHTML = "Unable to Cancel";
        //disable cancel drop
        disableId("drop-select-cancel");
    }
    else {
        //enable cancel drop
        undisableId("drop-select-cancel");
    }
}

function clearDropSelect() {
    if (gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length === 0) {
        var confirmCancelDrop = confirm("Cancel Supply Drop?");

        if (confirmCancelDrop) {
            //clear queue
            gameVars.globalGameOptions.supplyInfo.supplyDropQueue = [];
            //remove map select class
            removeAllClassFromMapbuttons("map-select");
            //remove drop threats
            removeAllClassFromMapbuttons("drop-threat");
            //remove drop buttons
            removeElement("map-screen-toolbar", "drop-select-cancel");
            removeElement("map-screen-toolbar", "make-drop");
            removeAllWildCardButtons();
            //change mode
            gameVars.gameStatus.mode = "attack";
            //go back to choose attack
            beginAttack();
        }
    }
    else {
        //clear queue
        gameVars.globalGameOptions.supplyInfo.supplyDropQueue = [];
        //remove map select class
        removeAllClassFromMapbuttons("map-select");
        //remove drop threats
        removeAllClassFromMapbuttons("drop-threat");
        //map note
        document.getElementById("map-note").innerHTML = "Drops Remaining: ".concat(3 - gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length);
        //update cancel button
        document.getElementById("drop-select-cancel").innerHTML = "Cancel Supply Drop";
        //check for max to disable cancel
        maxSupplyCheck();
        //remove all wild card buttons
        removeAllWildCardButtons();
        //disable make drop button
        disableId("make-drop");
        //make wild drop button for each wild card
        buildWildCardButtons();
    }
}

function chooseSupplyDrop(country) {
    var isAlreadyClicked = isItemInArray(country, gameVars.globalGameOptions.supplyInfo.supplyDropQueue);

    //check for already clicked
    if (isAlreadyClicked === false || country === "none") {
        if (isSupplyable(country) && gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length < 3) {
            if (gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length === 0) {
                //update cancel button
                document.getElementById("drop-select-cancel").innerHTML = "Clear Selected Drops";
                undisableId("drop-select-cancel");
            }
            if (country !== "none") {
                //add class map select
                addClass(country, "map-select");
                for (var i = 0; i < findFullCountryWithCountry(country).borders.length; i++) {
                    addClass(findFullCountryWithCountry(country).borders[i], "drop-threat");
                }
            }
            //add country to queue
            gameVars.globalGameOptions.supplyInfo.supplyDropQueue.push(country);
            //map note
            document.getElementById("map-note").innerHTML = "Drops Remaining: ".concat(3 - gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length);
            //create make drop button after 3 drops
            if (gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length === 3) {
                //enable make drop button
                undisableId("make-drop");
            }
        }
    }
} 

function isSupplyable(currentCountry) {
    var currentPlayer = gameVars.gameStatus.turn,
    currentPlayerSupplyHand = gameVars.playerInfo["player" + currentPlayer].playerSupplyPoints,
    currentSupplyHandPlayableCountries = [];

    //future version
    //make the drop type specific

    for (var i = 0; i < currentPlayerSupplyHand.length; i++) {
        if (!!currentPlayerSupplyHand[i]) {
            currentSupplyHandPlayableCountries.push(currentPlayerSupplyHand[i].supplyCountry);
        }
    }
    if (isItemInArray(currentCountry, currentSupplyHandPlayableCountries)) {
        gameVars.mapInfo.playableSupply.push(currentCountry);
        return true;
    }
    return false;
}

function buildWildCardButtons() {
    if (countWildSupply(gameVars.playerInfo["player" + gameVars.gameStatus.turn].playerSupplyPoints) > 0) {
        for (var i = 0; i < countWildSupply(gameVars.playerInfo["player" + gameVars.gameStatus.turn].playerSupplyPoints); i++) {
        //add wild card button
        addElement("map-screen-toolbar", "button", "Use Wild Card", "wild-drop" + i, "map-button", dropWildCard)
        }
    }
}

function goToSupplyDrop() {
    //update message and note
    document.getElementById("map-message").innerHTML = findPlayerName(gameVars.gameStatus.turn) + " Choose Supply Drop";
    document.getElementById("map-note").innerHTML = "Drops Remaining: ".concat(3 - gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length);
    //remove suply drop button
    removeElement("map-screen-toolbar", "supply-drop-button");
    //remove deline attack button
    removeElement("map-screen-toolbar", "decline-attack");
    //remove confirm attack
    removeElement("map-screen-toolbar", "confirm-attack");
    //change mode
    gameVars.gameStatus.mode = "drop";
    //make cancel drop button
    addElement("map-screen-toolbar", "button", "Cancel Supply Drop", "drop-select-cancel", "map-button", clearDropSelect);

    //check for max to disable cancel
    maxSupplyCheck();


    //make confirm drop button and disable
    addElement("map-screen-toolbar", "button", "Make Supply Drop", "make-drop", "map-button", makeSupplyDrop);
    disableId("make-drop");
    //make wild drop button for each wild card
    buildWildCardButtons();
    //rebuild map buttons
    buildMapButtons();
}

function selectSupplyDrop() {
    var confirmDrop = confirm(findPlayerName(gameVars.gameStatus.turn) + " Go to Supply Drop?");

    if (confirmDrop) {
        goToSupplyDrop();
    }
}

function countWildSupply(currentSupplyHand){
    wildCount = 0;

    for (var i = 0; i < currentSupplyHand.length; i++) {
        if (!!currentSupplyHand[i] && currentSupplyHand[i].supplyType === "wild") {
            wildCount += 1;
        }
    }
    return wildCount;
}

function countSupplyTypes(currentSupplyHand) {
    types = [];

    for (var i = 0; i < currentSupplyHand.length; i++) {
        if (!!currentSupplyHand[i] && currentSupplyHand[i].supplyType !== "wild") {
            types.push(currentSupplyHand[i].supplyType)
        }
    }
    return findUniqueValuesInArray(types).length;
}

function supplyDropAvailable(currentSupplyHand) {
    var countWild = countWildSupply(currentSupplyHand),
    countTypes = countSupplyTypes(currentSupplyHand),
    supplyNeeded = gameVars.globalGameOptions.supplyInfo.droppedPerSession;

    /*future version to check supply types
    if (currentSupplyHand.length >= supplyNeeded && countWild >= 1) {
        return true;
    }
    else if (currentSupplyHand.length >= supplyNeeded && countTypes === 3) {
        return true;
    }
    else if (currentSupplyHand.length >= supplyNeeded && countTypes === 1) {
        return true;
    }
    */

    if (currentSupplyHand.length >= supplyNeeded) {
        //future version
        //remove this when drop is type specific
        return true;
    }
    return false;
}

function supplyDropCheck() {
    var currentPlayer = gameVars.gameStatus.turn,
    currentSupplyHand = gameVars.playerInfo["player" + currentPlayer].playerSupplyPoints,
    currentPlayerName = findPlayerName(currentPlayer),
    supplyDropReady = supplyDropAvailable(currentSupplyHand);

    if (currentSupplyHand.length >= gameVars.globalGameOptions.supplyInfo.maxSupplyPerPerson) {
        //force drop
        alert(currentPlayerName + " Forced Supply Drop");
        //go to drop
        goToSupplyDrop();
    }
    else if (supplyDropReady === true) {
        //create supply drop button
        addElement("map-screen-toolbar", "button", "Supply Drop", "supply-drop-button", "map-button", selectSupplyDrop);
    }
}