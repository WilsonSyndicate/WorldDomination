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

function dropWildCard() {
    //only if queue is less than3
    if (gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length < 3) {
    //count wild cards used
    var wildCardsPlayed = countItemsInArray("none", gameVars.globalGameOptions.supplyInfo.supplyDropQueue);
    //remove button for corresponding count
    removeElement("map-screen-toolbar", "wild-drop" + wildCardsPlayed);
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
        //change mode
        gameVars.gameStatus.mode = "attack";
        //go back to choose attack
        beginAttack();
    }
}

function removeAllWildCardButtons() {
    console.log("buttons removed");
    removeElement("map-screen-toolbar", "wild-drop0");
    removeElement("map-screen-toolbar", "wild-drop1");
}

function clearDropSelect() {
    //clear queue
    gameVars.globalGameOptions.supplyInfo.supplyDropQueue = [];
    //remove map select class
    removeAllClassFromMapbuttons("map-select");
    //map note
    document.getElementById("map-note").innerHTML = 3 - gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length;
    //remove clear drop button
    removeElement("map-screen-toolbar", "drop-select-cancel");
    //remove all wild card buttons
    removeAllWildCardButtons();
    //remove make drop button
    removeElement("map-screen-toolbar", "make-drop");
}

function chooseSupplyDrop(country) {
    var isAlreadyClicked = isItemInArray(country, gameVars.globalGameOptions.supplyInfo.supplyDropQueue);

    //check for already clicked
    if (isAlreadyClicked === false || country === "none") {
        if (isSupplyable(country) && gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length < 3) {
            if (gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length === 0) {
                addElement("map-screen-toolbar", "button", "Clear Selected Drops", "drop-select-cancel", "map-button", clearDropSelect);
            }
            if (country !== "none") {
                //add class map select
                addClass(country, "map-select");
            }
            //add country to queue
            gameVars.globalGameOptions.supplyInfo.supplyDropQueue.push(country);
            //map note
            document.getElementById("map-note").innerHTML = 3 - gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length;
            //create make drop button after 3 drops
            if (gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length === 3) {
                addElement("map-screen-toolbar", "button", "Make Supply Drop", "make-drop", "map-button", makeSupplyDrop);
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
    document.getElementById("map-note").innerHTML = 3 - gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length;

    //remove suply drop button
    removeElement("map-screen-toolbar", "supply-drop-button");
    //remove deline attack button
    removeElement("map-screen-toolbar", "decline-attack");
    //change mode
    gameVars.gameStatus.mode = "drop";
    //make wild drop button for each wild card
    buildWildCardButtons();
    //rebuild map buttons
    buildMapButtons();
}

function selectSupplyDrop() {
    var confirmDrop = alert(findPlayerName(gameVars.gameStatus.turn) + " Must Go to Supply Drop");

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

    /*
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
        //add drop button
        addElement("map-screen-toolbar", "button", "Supply Drop", "supply-drop-button", "map-buton", selectSupplyDrop);
    }
}