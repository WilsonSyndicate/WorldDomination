// drop map



function returnSupplyDropCard(country) {
    var currentPlayer = gameVars.gameStatus.turn,
    currentPlayerSupply = gameVars.playerInfo["player" + currentPlayer].playerSupplyPoints;


    //needs to find a card with corresponding country
    for (var i = 0; i < currentPlayerSupply.length; i++) {
        if (currentPlayerSupply[i].supplyCountry === country) {
            //remove it from the current player hand
            var supplyToMove = currentPlayerSupply[i].slice([i]);
            //add it to the turned in set
            gameVars.globalGameOptions.supplyInfo.supplyDropCardsTurnedIn.push(supplyToMove);
        }
    }

    console.log(country + " supply card returned");
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


    console.log("add dugout deck into game");


    //return deck name
    return newDeckName
}

function dropWildCard() {
    //only if queue is less than3
    if (gameVars.globalGameOptions.supplyInfo.supplyDropQueue < 3) {

    //count wild cards used
    var wildCardsPlayed = countWildSupply(gameVars.globalGameOptions.supplyInfo.supplyDropQueue);
    
    //remove button for corresponding count
    removeElement("map-screen-toolbar", "wild-drop" + wildCardsPlayed);
    
    //add to queue list
    gameVars.globalGameOptions.supplyInfo.supplyDropQueue.push({supplyType: "wild", supplyCountry: "none"});


    console.log("play wild card");
    }
}

function reshuffleSupplyDeck() {
    var countriesToAdd = [],
    newSupplyDropDeck = [],
    supplyPointTypes = gameVars.globalGameOptions.supplyInfo.numberOfSupplyPointTypes,
    currentSupplyType = 0;

    for (var i = 0; i < gameVars.globalGameOptions.supplyInfo.supplyDropCardsTurnedIn.length; i++) {
        countriesToAdd.push(gameVars.globalGameOptions.supplyInfo.supplyDropCardsTurnedIn.supplyCountry);
    }
    //clear turned in deck
    gameVars.globalGameOptions.supplyInfo.supplyDropCardsTurnedIn = [];
    //build new draw pile
    for (var d = 0; d < countriesToAdd.length; d++) {
        if (countriesToAdd[d] === "none") {
            newSupplyDropDeck.push({"supplyType": "wild", "supplyCountry": "none"});
        }
        else {
            currentSupplyType += 1;
            newSupplyDropDeck.push({"supplyType": currentSupplyType, "supplyCountry": countriesToAdd[d]});
    
            if (currentSupplyType === supplyPointTypes) {
                currentSupplyType = 0;
            }
        }
    }
    shuffleArray(newSupplyDropDeck);
    gameVars.globalGameOptions.supplyInfo.supplyDropCardsToDraw = newSupplyDropDeck;

    console.log("supply deck reshuffled");
}

function makeSupplyDrop() {
    //do this for each country in queue
    for (var i = 0; i < gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length; i++) {
        var country = gameVars.globalGameOptions.supplyInfo.supplyDropQueue[i],
        fullCountry = findFullCountryWithCountry(country),
        currentPlayerName = findPlayerName(gameVars.gameStatus.turn),
        logText = "Supply Drop by " + currentPlayerName +" on " + fullCountry.countryName;

        //wild drop
        if (country === "none") {
            logText += "Wild Card Dropped";
        }
        else {
            //country drop
            if (!!fullCountry.deck) {
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
        console.log(country + " is supply drop country");
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
    console.log("supply dropped and returned to attack");
}

function removeAllWildCardButtons() {
    for (var i = 0; i < gameVars.globalGameOptions.supplyInfo.numberOfRandomSupplyPoints; i++) {
        removeElement("map-screen-toolbar", "wild-drop" + i);
    }
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
    //add wild card buttons
    buildWildCardButtons();
}

function chooseSupplyDrop(country) {
    if (isSupplyable(country) && gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length < 3) {
        if (gameVars.globalGameOptions.supplyInfo.supplyDropQueue.length === 0) {
            addElement("map-screen-toolbar", "button", "Clear Selected Drops", "drop-select-cancel", "map-button", clearDropSelect);
        }
        //add class map select
        addClass(country, "map-select");
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

    console.log("go to drop");
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

    if (currentSupplyHand.length >= supplyNeeded && countWild >= 1) {
        return true;
    }
    else if (currentSupplyHand.length >= supplyNeeded && countTypes === 3) {
        return true;
    }
    else if (currentSupplyHand.length >= supplyNeeded && countTypes === 1) {
        return true;
    }
    else if (currentSupplyHand.length >= supplyNeeded) {
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
        addElement("map-screen-toolbar", "button", "Supply Drop", "supply-drop-button", "map-buton", selectToSupplyDrop);
    }
}