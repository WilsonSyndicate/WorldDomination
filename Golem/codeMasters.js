
//Handle Planar Cards
function planarPrompt(promptText) {
    //show prompt text
    document.getElementById("planar-choice-text").innerHTML = promptText;
    //show prompt
    removeClass("planar-prompt", "hide-item-class");
}

function handleNormalPlanePrompt() {
    var planeText = "Planeswalk to Next Plane?";

    //prompt for planeswalk
    planarPrompt(planeText);
    addElement("planar-choice-menu", "div", "Planeswalk", "planeswalk", "noClass", rollNextPlane);
    addElement("planar-choice-menu", "div", "Cancel", "cancel-prompt", "noClass", cancelPrompt);
}

function poolsChaos() {
    //remove previous choices
    removeElement("planar-choice-menu", "cancel-prompt");
    removeElement("planar-choice-menu", "pools-chaos");
    removeElement("planar-choice-menu", "planeswalk");
    //reveals next 3 cards in a row and puts on bottom
    shufflePlanarDeck();
    //move pools to top front
    gameVars.battleScreenInfo.planarDeck = moveArrayObjectToBeginningOfArray("Pools of Becoming", gameVars.battleScreenInfo.planarDeck);
    //show pools on battle screen
    document.getElementById("battle-defense-plane").style.backgroundImage = getPlanarPicture(gameVars.battleScreenInfo.planarDeck[0]);
    //add an element that shows next plane, click puts it on bottom for 3 clicks
    addElement("planar-choice-menu", "div", "noContent", "pools-reveal", "reveal-one-card", poolsCardClick);
    //show first card
    document.getElementById("pools-reveal").style.backgroundImage = getPlanarPicture(gameVars.battleScreenInfo.planarDeck[1]);
    //update card count
    gameVars.battleScreenInfo.currentPlanarCard = 1;
    //update prompt text
    document.getElementById("planar-choice-text").innerHTML = "These 3 planar abilities happen (Phenomenons do nothing), click once ability is complete:";
}

function poolsCardClick() {
    var planarAbilities = 2 - gameVars.battleScreenInfo.currentPlanarCard;

    if (gameVars.battleScreenInfo.currentPlanarCard === 3) {
        //move previous 3 cards to bottom
        gameVars.battleScreenInfo.planarDeck = moveArrayObjectToEndOfArray(gameVars.battleScreenInfo.planarDeck[1], gameVars.battleScreenInfo.planarDeck);
        gameVars.battleScreenInfo.planarDeck = moveArrayObjectToEndOfArray(gameVars.battleScreenInfo.planarDeck[1], gameVars.battleScreenInfo.planarDeck);
        gameVars.battleScreenInfo.planarDeck = moveArrayObjectToEndOfArray(gameVars.battleScreenInfo.planarDeck[1], gameVars.battleScreenInfo.planarDeck);
        //adjust planar card count
        gameVars.battleScreenInfo.currentPlanarCard -= 3;
        //cleanup prompt
        removeElement("planar-choice-menu", "pools-reveal");
        //go back to battle screen
        addClass("planar-prompt", "hide-item-class");
    }
    else {
        //update prompt text
        document.getElementById("planar-choice-text").innerHTML = planarAbilities + " more planar abilities will happen (Phenomenons do nothing), click once ability is complete:";
        //update card count
        gameVars.battleScreenInfo.currentPlanarCard += 1;
        //show current card
        document.getElementById("pools-reveal").style.backgroundImage = getPlanarPicture(gameVars.battleScreenInfo.planarDeck[gameVars.battleScreenInfo.currentPlanarCard]);
    }
}

function cancelPrompt() {
    //remove previous choices
    removeElement("planar-choice-menu", "cancel-prompt");
    removeElement("planar-choice-menu", "pools-chaos");
    removeElement("planar-choice-menu", "stairs-chaos");
    removeElement("planar-choice-menu", "planeswalk");
    //hide prompt
    addClass("planar-prompt", "hide-item-class");
    document.getElementById("planar-choice-text").innerHTML = "";
}

function handlePoolsOfBecoming() {
    var planeText = "Planeswalk or Chaos?";

    //prompt for planeswalk or chaos
    planarPrompt(planeText);
    addElement("planar-choice-menu", "div", "Chaos Roll", "pools-chaos", "noClass", poolsChaos);
    addElement("planar-choice-menu", "div", "Planeswalk", "planeswalk", "noClass", rollNextPlane);
    addElement("planar-choice-menu", "div", "Cancel", "cancel-prompt", "noClass", cancelPrompt);
}

function stairsChaosYes() {
    var stairsCount = findItemRefInArray("Stairs to Infinity", gameVars.battleScreenInfo.planarDeck);

    //move plane card to bottom
    gameVars.battleScreenInfo.planarDeck = moveArrayObjectToEndOfArray(gameVars.battleScreenInfo.planarDeck[stairsCount + 1], gameVars.battleScreenInfo.planarDeck);
    //clear prompt
    stairsChaosNo();
}

function stairsChaosNo() {
    //remove previous choices
    removeElement("planar-choice-menu", "stairs-yes");
    removeElement("planar-choice-menu", "stairs-no");
    removeElement("planar-choice-menu", "stairs-reveal");
    //hide prompt
    addClass("planar-prompt", "hide-item-class");
}

function stairsChaos() {
    var stairsCount = findItemRefInArray("Stairs to Infinity", gameVars.battleScreenInfo.planarDeck);

    //remove previous choices
    removeElement("planar-choice-menu", "cancel-prompt");
    removeElement("planar-choice-menu", "stairs-chaos");
    removeElement("planar-choice-menu", "planeswalk");
    //add yes and no buttons
    addElement("planar-choice-menu", "div", "Yes", "stairs-yes", "stairs-chaos-yes", stairsChaosYes);
    addElement("planar-choice-menu", "div", "No", "stairs-no", "stairs-chaos-no", stairsChaosNo);
    //do this if on last card
    if (gameVars.battleScreenInfo.planarDeck.length - 1 === stairsCount) {
        //reveals next 3 cards in a row and puts on bottom
        shufflePlanarDeck();
        //move stairs to top front
        gameVars.battleScreenInfo.planarDeck = moveArrayObjectToBeginningOfArray("Stairs to Infinity", gameVars.battleScreenInfo.planarDeck);
        //show stairs on battle screen
        document.getElementById("battle-defense-plane").style.backgroundImage = getPlanarPicture(gameVars.battleScreenInfo.planarDeck[0]);
        //update stairs count
        stairsCount = findItemRefInArray("Stairs to Infinity", gameVars.battleScreenInfo.planarDeck);
    }
    //add an element that shows next plane, click puts it on bottom for 3 clicks
    addElement("planar-choice-menu", "div", "noContent", "stairs-reveal", "reveal-one-card");
    //show next card
    document.getElementById("stairs-reveal").style.backgroundImage = getPlanarPicture(gameVars.battleScreenInfo.planarDeck[stairsCount + 1]);
    //update prompt text
    document.getElementById("planar-choice-text").innerHTML = "Would you like to put this Planar card on the bottom?";
}

function handleStairsToInfinity() {
    var planeText = "Planeswalk or Chaos?";

    //prompt for planeswalk or chaos
    planarPrompt(planeText);
    addElement("planar-choice-menu", "div", "Chaos Roll", "stairs-chaos", "noClass", stairsChaos);
    addElement("planar-choice-menu", "div", "Planeswalk", "planeswalk", "noClass", rollNextPlane);
    addElement("planar-choice-menu", "div", "Cancel", "cancel-prompt", "noClass", cancelPrompt);
}

function tunnelChoice(choice) {    
    newPlanarDeck = [],
    cardsForBottom = [];

    //shuffle other 4 and phenomenoms and put on bottom of deck
    for (var i = 0; i < gameVars.battleScreenInfo.planarDeck.length; i++) {
        if (isItemInArray(gameVars.battleScreenInfo.planarDeck[i], gameVars.battleScreenInfo.planarTemp)) {
            if (gameVars.battleScreenInfo.planarDeck[i] === choice) {
                newPlanarDeck.push(gameVars.battleScreenInfo.planarDeck[i]);
            }
            else {
                cardsForBottom.push(gameVars.battleScreenInfo.planarDeck[i]);
            }
        }
        else {
            newPlanarDeck.push(gameVars.battleScreenInfo.planarDeck[i]);
        }

    }
    //shuffle bottom cards
    shuffleArray(cardsForBottom);
    //move all other 4 to bottom in random order
    for (var r = 0; r < cardsForBottom.length; r++) {
        newPlanarDeck.push(cardsForBottom[r]);
    }
    gameVars.battleScreenInfo.planarDeck = newPlanarDeck;
    //cleanup and hide prompt
    removeElement("planar-choice-box", "planar-choice-menu");
    addElement("planar-choice-box", "div", "noContent", "planar-choice-menu");
    //clear temp
    gameVars.battleScreenInfo.planarTemp = [];
    //roll to next plane
    rollNextPlane();
}

function tunnelPlaneswalk() {
    var tunnelPreviewCards = [];

    //remove choices
    removeElement("planar-choice-menu", "cancel-prompt");
    removeElement("planar-choice-menu", "planeswalk");
    //reveals until 5 plane cards are found and player chooses next, rest on bottom in a random order
    shufflePlanarDeck();
    //move stairs to top
    gameVars.battleScreenInfo.planarDeck = moveArrayObjectToBeginningOfArray("Interplanar Tunnel", gameVars.battleScreenInfo.planarDeck);
    //show stairs on battle screen
    document.getElementById("battle-defense-plane").style.backgroundImage = getPlanarPicture(gameVars.battleScreenInfo.planarDeck[0]);
    //clear temp
    gameVars.battleScreenInfo.planarTemp = [];
    //finds next 5
    for (var i = 1; i < gameVars.battleScreenInfo.planarDeck.length; i++) {
        if (tunnelPreviewCards.length < 5 && isPlanePhenomenom(gameVars.battleScreenInfo.planarDeck[i]) === false) {
            tunnelPreviewCards.push(gameVars.battleScreenInfo.planarDeck[i]);
            //copy name to planar temp
            gameVars.battleScreenInfo.planarTemp.push(gameVars.battleScreenInfo.planarDeck[i]);
        }
        else if (tunnelPreviewCards.length < 5) {
            //copy name to planar temp
            gameVars.battleScreenInfo.planarTemp.push(gameVars.battleScreenInfo.planarDeck[i]);
        }
    }
    //build a button for each of 5 planes
    for (var p = 0; p < tunnelPreviewCards.length; p++) {
        addElement("planar-choice-menu", "div", "noContent", tunnelPreviewCards[p], "reveal-five-cards", tunnelChoice);
        //show plane card
        document.getElementById(tunnelPreviewCards[p]).style.backgroundImage = getPlanarPicture(tunnelPreviewCards[p]);
    }
}

function isPlanePhenomenom(planeName) {
    phenomenomNameList = [];

    for (var i = 0; i < phenomenomDeck.length; i++) {
        phenomenomNameList.push(phenomenomDeck[i].planeName);
    }
    return isItemInArray(planeName, phenomenomNameList);
}

function handleInterplanarTunnel() {
    var planeText = "Planeswalk into the Interplanar Tunnel?";

    planarPrompt(planeText);
    addElement("planar-choice-menu", "div", "Interplanar Tunnel", "planeswalk", "noClass", tunnelPlaneswalk);
    addElement("planar-choice-menu", "div", "Cancel", "cancel-prompt", "noClass", cancelPrompt);
}

//gameVars.battleScreenInfo.planarDeck[2] = "Chaotic Aether"
function aetherPlaneswalk() {

    //reveal until 1 plane card is found and go first and next in second card space
    //shufflePlanarDeck();
    //second card space
    console.log("Aether");   
    //planeswalks to next plane with this phenomenom added in second card space
}

function handleChaoticAether() {
    var planeText = "Planeswalk into the Chaotic Aether?";

    planarPrompt(planeText);
    addElement("planar-choice-menu", "div", "Chaotic Aether", "planeswalk", "noClass", aetherPlaneswalk);
    addElement("planar-choice-menu", "div", "Cancel", "cancel-prompt", "noClass", cancelPrompt);
}

function mergingPlaneswalk() {
    //reveal until 2 plane cards are found and go first and next in second card space
    //shufflePlanarDeck();
    //add second card space
    console.log("spacial merging")
    //display next two planar cards (phenomenoms go to bottom)

}

function handleSpacialMerging() {  
    var planeText = "Planeswalk into the next two planes Spacial Merging?";

    planarPrompt(planeText);
    addElement("planar-choice-menu", "div", "Spacial Merging", "planeswalk", "noClass", mergingPlaneswalk);
    addElement("planar-choice-menu", "div", "Cancel", "cancel-prompt", "noClass", cancelPrompt);   
}

//Code Masters
function findItemRefInArray(item, array) {
    for (var i = 0; i < array.length; i++) {
        if (item === array[i]) {
            return i;
        }
    }
}

function moveArrayObjectToEndOfArray(object, array) {
    var newArray = [];

    for (var i = 0; i < array.length; i++) {
        if (object !== array[i]) {
            newArray.push(array[i]);
        }
    }
    newArray.push(object);
    return newArray;
}

function moveArrayObjectToBeginningOfArray(object, array) {
    var newArray = [];

    for (var i = 0; i < array.length; i++) {
        if (object === array[i]) 
        newArray.push(object);
    }
    for (var a = 0; a < array.length; a++) {
        if (array[a] !== object) {
            newArray.push(array[a]);
        }
    }
    return newArray;
}

function findPlaneContinent(planeName) {
    for (var i = 0; i < planarDeck.length; i++) {
        if (planarDeck[i].planeName === planeName) {
            return planarDeck[i].planeContinent;
        }
    }
}

function findCountryContinent(country) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].country === country) {
            return gameVars.mapInfo.countryList[i].continent;
        }
    }
}

function findDefensePlaneRefWithPlayerAndDeckName(player, deckName) {
    var playerDecklist = gameVars.playerInfo["player" + player].playerDecklist;

    for (var i = 0; i < playerDecklist.length; i++) {
        if (playerDecklist[i].deckName === deckName && !!playerDecklist[i].defensePlane) {
            for (var d = 0; d < planarDeck.length; d++) {
                if (playerDecklist[i].defensePlane === planarDeck[d].planeName) {
                    return d;
                }
            }
        }
    }  
}

function findDefenseDecks(playerNumber, defenseName) {
    defenseDecks = [];

    for (var i = 0; i < gameVars.playerInfo["player" + playerNumber].playerDecklist.length; i++) {
        var currentDeck = gameVars.playerInfo["player" + playerNumber].playerDecklist[i];
        
        if (!!currentDeck.defensePlane && currentDeck.deckEliminated === false && currentDeck.defensePlane === defenseName) {
            defenseDecks.push(currentDeck.deckName);
        }
    }
    return defenseDecks;
}

function findContinentColor(continent) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].continent === continent) {
            return gameVars.mapInfo.countryList[i].color;
        }
    }
}

function cleanupHeroAndConspiracy() {
    gameVars.mapInfo.heroConspiracyPlayed = findUniqueValuesInArray(gameVars.mapInfo.heroConspiracyPlayed)
}

function playerDeckCount(player) {
    var deckCount = 0;

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (!!gameVars.mapInfo.countryList[i].deck && gameVars.mapInfo.countryList[i].deck.deckPlayer === player) {
            deckCount += 1;
        }
    }
    return deckCount;
}

function findContinentWithCountry(country) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].country === country) {
            return gameVars.mapInfo.countryList[i].continent;
        }
    }
}

function colorOnList(continentColor, deckColorList) {
    if (continentColor === "WUBRG") {
        if (deckColorList === "WUBRG") {
            return true;
        }
        return false;
    }
    else {
        for (var i = 0; i < deckColorList.length; i++) {
            if (continentColor === deckColorList[i]) {
                return true;
            }
        }
        return false;
    }
}

function listControlledContinentsWithPlayerAndColor(player, deckColors) {
    var continentBonus = [];

    for (var i = 0; i < gameVars.mapInfo.continentsControlled.length; i++) {
        var currentContinentColor = adminSettings.continentBonuses[gameVars.mapInfo.continentsControlled[i][0]];

        if (gameVars.mapInfo.continentsControlled[i][1] === player && colorOnList(currentContinentColor, deckColors)) {
            continentBonus.push(gameVars.mapInfo.continentsControlled[i][0]);
        }
    }
    return continentBonus;
}

function listOwnedContinentsWithPlayerAndColor(player, deckColors) {
    var continentBonus = [];
    
    for (var i = 0; i < gameVars.mapInfo.continentsOwned.length; i++) {
        var currentContinentColor = gameVars.mapInfo.continentsOwned[i][2];

        if (gameVars.mapInfo.continentsOwned[i][1] === player && colorOnList(currentContinentColor, deckColors)) {
            continentBonus.push(gameVars.mapInfo.continentsControlled[i][0]);
        }
    }
    return continentBonus;
}

function getDeckColors(deckPlayer, deckName) {
    for (var i = 0; i < gameVars.playerInfo["player" + deckPlayer].playerDecklist.length; i++) {
        if (gameVars.playerInfo["player" + deckPlayer].playerDecklist[i].deckName === deckName) {
            return gameVars.playerInfo["player" + deckPlayer].playerDecklist[i].deckColors;
        }
    }
    console.log("Unable to find Deck Colors");
}

function cleanupContinentOwnedList() {
    for (var i = 0; i < gameVars.mapInfo.continentsOwned.length; i++) {
        var currentContinent = gameVars.mapInfo.continentsOwned[i][0],
        currentPlayer = gameVars.mapInfo.continentsOwned[i][1];

        //remove if no longer owning
        if (numberOfCountriesOnContinent(currentContinent) !== playerDecksOnContinent(currentPlayer, currentContinent)) {
            gameVars.mapInfo.continentsOwned = removeItemFromArray(gameVars.mapInfo.continentsOwned[i], gameVars.mapInfo.continentsOwned);
        }
    }
}

function countriesInContinent(continent) {
    var countryList = [];

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].continent === continent) {
            countryList.push(gameVars.mapInfo.countryList[i].country);
        }
    }
    return countryList;
}

function cleanupContinentControlledList() {
    for (var i = 0; i < gameVars.mapInfo.continentsControlled.length; i++) {
        var currentContinent = gameVars.mapInfo.continentsControlled[i][0],
        currentPlayer = gameVars.mapInfo.continentsControlled[i][1],
        countryList = countriesInContinent(currentContinent);

        //remove if no longer controlled
        for (var c = 0; c < countryList.length; c++) {
            if (currentPlayer !== findCountryPlayer(countryList[c]) && findCountryPlayer(countryList[c]) !== undefined) {
                gameVars.mapInfo.continentsControlled = removeItemFromArray(gameVars.mapInfo.continentsControlled[i], gameVars.mapInfo.continentsControlled);
            }
        }
    }
}

function playerDecksOnContinent(player, continent) {
    var totalPlayerDecks = 0;

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        var currentFullCountry = gameVars.mapInfo.countryList[i];

        if (!!currentFullCountry.deck && currentFullCountry.deck.deckPlayer === player && currentFullCountry.continent === continent) {
            totalPlayerDecks += 1;
        }
    }
    return totalPlayerDecks;
}

function numberOfCountriesOnContinent(continent) {
    var countryCount = 0;

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].continent === continent) {
            countryCount += 1;
        }
    }
    return countryCount;
}

function continentsWithCountries() {
    var allContinents = continentList(),
    continentsWithCountryList = [];

    //for each continent
    for (var i = 0; i < allContinents.length; i++) {
        var tempContinentList = [];
        //add continent name to list
        tempContinentList.push(allContinents[i]);
        //add all countries on that continent to list
        for (var y = 0; y < gameVars.mapInfo.countryList.length; y++) {
            if (gameVars.mapInfo.countryList[y].continent === tempContinentList[0]) {
                tempContinentList.push(gameVars.mapInfo.countryList[y].country);
            }
        }
        //add list to return variable
        continentsWithCountryList.push(tempContinentList);
    }
    return continentsWithCountryList;
}

function continentList() {
    var continentList = [];

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        var currentContinent = gameVars.mapInfo.countryList[i].continent;

        if (isItemInArray(currentContinent, continentList) === false) {
            continentList.push(currentContinent);
        }
    }
    return continentList;
}

function findFullHeroWithName(currentHeroName) {
    for (var i = 0; i < heroDeck.length; i++) {
        if (heroDeck[i].heroName === currentHeroName) {
            return heroDeck[i];
        }
    }
}

function findFullConspiracyWithName(currentConspiracyName) {
    for (var i = 0; i < conspiracyDeck.length; i++) {
        if (conspiracyDeck[i].conspiracyName === currentConspiracyName) {
            return conspiracyDeck[i];
        }
    }
}

function findHeroRef(currentHeroName) {
    for (var i = 0; i < heroDeck.length; i++) {
        if (heroDeck[i].heroName === currentHeroName) {
            return i;
        }
    }
}

function findConspiracyRef(currentConspiracyName) {
    for (var i = 0; i < conspiracyDeck.length; i++) {
        if (conspiracyDeck[i].conspiracyName === currentConspiracyName) {
            return i;
        }
    }
}

function findVanguardRef(currentVanguardName) {
    for (var i = 0; i < vanguardDeck.length; i++) {
        if (vanguardDeck[i].vanguardName === currentVanguardName) {
            return i;
        }
    }
}

function endAnimateCountry(country) {
    var oldMatrixA = gameVars.mapInfo.backupCountryMatrix[0],
    oldMatrixD = gameVars.mapInfo.backupCountryMatrix[1],
    oldMatrixE = gameVars.mapInfo.backupCountryMatrix[2],
    oldMatrixF = gameVars.mapInfo.backupCountryMatrix[3];

    //set old matrix
    document.getElementById(country).style.transform = "matrix(" + oldMatrixA + ", 0, 0, " + oldMatrixD + ", " + oldMatrixE + ", " + oldMatrixF + ")";
}

function animateCountry(country) {
    var style = window.getComputedStyle(document.getElementById(country)),
    matrix = new WebKitCSSMatrix(style.webkitTransform),
    newMatrixA = matrix.a,
    newMatrixD = matrix.d,
    newMatrixE = matrix.e,
    newMatrixF = matrix.f,
    matrixAIncrease = 0.05,
    matrixDIncrease = 0.05,
    matrixEIncrease = -10,
    matrixFIncrease = -10;

    //save previous matrix values
    gameVars.mapInfo.backupCountryMatrix[0] = newMatrixA;
    gameVars.mapInfo.backupCountryMatrix[1] = newMatrixD;
    gameVars.mapInfo.backupCountryMatrix[2] = newMatrixE;
    gameVars.mapInfo.backupCountryMatrix[3] = newMatrixF;
    
    //add increase
    newMatrixA = matrix.a += matrixAIncrease;
    newMatrixD = matrix.d += matrixDIncrease;
    newMatrixE = matrix.e += matrixEIncrease;
    newMatrixF = matrix.f += matrixFIncrease;
    /*
    var interval = setInterval(frame, 5);

    function frame() {
        if (interval == 5) {
            //set old matrix
            document.getElementById(country).style.transform = "matrix(" + gameVars.mapInfo.backupCountryMatrix[0] + ", 0, 0, " + gameVars.mapInfo.backupCountryMatrix[1] + ", " + gameVars.mapInfo.backupCountryMatrix[2] + ", " + gameVars.mapInfo.backupCountryMatrix[3] + ")";

            //transition timing
            document.getElementById(country).style.transitionDuration = "1s";
            //reset interval
            interval = 0;
        }
        else {
    */
            //set new matrix
            document.getElementById(country).style.transform = "matrix(" + newMatrixA + ", 0, 0, " + newMatrixD + ", " + newMatrixE + ", " +newMatrixF + ")";
    /*
            //count interval
            interval += 1;
        }
    }
    */
}

function stringToDate(string) {
    var newDate = Date(string),
    parts = newDate.split(' '),
    findTimeZone = [];

    for (var i = 6; i <= parts.length; i++) {
        findTimeZone.push(parts[i]);
    }
    return [parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], findTimeZone];
}

function getNextTurn() {
    for (var i = 0; i < gameVars.gameStatus.turnOrder.length; i++) {
        var currentTurn = gameVars.gameStatus.turn,
        lastTurn = gameVars.gameStatus.turnOrder[gameVars.gameStatus.turnOrder.length - 1];

        if (currentTurn === lastTurn) {
            return gameVars.gameStatus.turnOrder[0];
        }
        else if (gameVars.gameStatus.turnOrder[i] === currentTurn) {
            return gameVars.gameStatus.turnOrder[i + 1];
        }
    }
}

function countItemsInArray(item, array) {
    var count = 0;

    for (var i = 0; i < array.length; i++) {
        if (array[i] === item) {
            count += 1;
        }
    }
    return count;
}

function playerCounrtyList(player) {
    var countryList = [];

    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (!!gameVars.mapInfo.countryList[i].deck && gameVars.mapInfo.countryList[i].deck.deckPlayer === player) {
            countryList.push(gameVars.mapInfo.countryList[i].country);
        }
    }
    return countryList;
}

function removeItemFromArray(itemToRemove, array) {
    var newArray = [];

    for (var i = 0; i < array.length; i++) {
        if (array[i] !== itemToRemove) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

function findFullPlayerWithPlayerNumber(playerNumber) {
    for (var i = 1; i <= gameVars.globalGameOptions.totalPlayers; i++) {
        if (playerNumber === i) {
            return gameVars.playerInfo["player" + i];
        }
    }
}

function isItemInArray(item, array) {
    for (var i = 0; i < array.length; i++) {
        if (item === array[i]) {
            return true;
        }
    }
    return false;
}

function findFullCountryWithDeckPlayerAndDeckName(deckPlayer, deckName) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (!!gameVars.mapInfo.countryList[i].deck && gameVars.mapInfo.countryList[i].deck.deckPlayer === deckPlayer && gameVars.mapInfo.countryList[i].deck.deckName === deckName) {
            return gameVars.mapInfo.countryList[i];
        }
    }
}

function doesCountryBorderFullCountry(country, fullCountry) {
    for (var i = 0; i < fullCountry.borders.length; i++) {
        if (fullCountry.borders[i] === country) {
            return true;
        }
    }
    return false;
}

function findFullDeckWithPlayerAndName(deckPlayer, deckName) {
    return gameVars.playerInfo["player" + deckPlayer].playerDecklist[findDeckRef(deckPlayer, deckName)]
}

function findFullCountryWithCountry(country) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].country === country) {
            return gameVars.mapInfo.countryList[i];
        }
    }
}

function findDeckRef(deckPlayer, deckName) {
    for (var i = 0; i < gameVars.playerInfo["player" + deckPlayer].playerDecklist.length; i++) {
        var currentDeck = gameVars.playerInfo["player" + deckPlayer].playerDecklist[i];

        if (deckName === currentDeck.deckName) {
            return i;
        }
    }
}

function shownDeckName(deckPlayer, deckName) {
    var fullPlayerInfo = gameVars.playerInfo["player" + deckPlayer];

    if (fullPlayerInfo.playerDecklist[findDeckRef(deckPlayer, deckName)].deckName === deckName) {
        var currentPlayerName = findPlayerName(deckPlayer),
        currentDeckName = fullPlayerInfo.playerDecklist[findDeckRef(deckPlayer, deckName)].deckName;

        if (fullPlayerInfo.playerDecklist[findDeckRef(deckPlayer, deckName)].deckHidden === true) {
            return currentPlayerName + "'s deck";
        }
        else {
            return currentPlayerName + "'s " + currentDeckName;
        }
    }
}

function showPregame() {
    hideId("intro-screen");
    hideId("battle-screen");
    hideId("map-screen");
    gameVars.gameStatus.focus = "pre-game";
    unhideId("pre-game-screen");
}

function showBattle() {
    hideId("pre-game-screen");
    hideId("intro-screen");
    hideId("map-screen");
    gameVars.gameStatus.focus = "attack";
    unhideId("battle-screen");
    createDefensePlane();
}

function showIntro() {
    hideId("pre-game-screen");
    hideId("battle-screen");
    hideId("map-screen");
    gameVars.gameStatus.focus = "intro";
    unhideId("intro-screen");
    updateIntroScreen();
}

function showMap() {
    hideId("pre-game-screen");
    hideId("battle-screen");
    hideId("intro-screen");
    gameVars.gameStatus.focus = "map";
    unhideId("map-screen");
}

function findCountryPlayer(country) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].country === country && !!gameVars.mapInfo.countryList[i].deck) {
            return gameVars.mapInfo.countryList[i].deck.deckPlayer;
        }
    }
}

function findUniqueValuesInArray(array) {
    var uniqueArray = [];

    //remove duplicates
    uniqueArray.push(array[0]);
    for (var i = 1; i < array.length; i++) {
        var currentArrayItem = array[i];

        if (uniqueArray.indexOf(currentArrayItem) === -1) {
            uniqueArray.push(currentArrayItem);
        }
    }
    return uniqueArray;
}

function disableId(id) {
    document.getElementById(id).disabled = true;
    addClass(id, 'disabled');
}

function undisableId(id) {
    document.getElementById(id).disabled = false;
    removeClass(id, 'disabled');
}

function numberSuffix(number) {
    var lastDigit = number.toString().split('').pop();

    switch (lastDigit) {
        case "1": return number + "st";
        case "2": return number + "nd";
        case "3": return number + "rd";
        default: return number + "th";
    }
}

function findCountryRef(country) {
    for (var i = 0; i < gameVars.mapInfo.countryList.length; i++) {
        if (gameVars.mapInfo.countryList[i].country === country) {
            return i;
        }
    }
}

function findDeckWithCountry(country) {
    if (!!gameVars.mapInfo.countryList[findCountryRef(country)].deck) {
        return gameVars.mapInfo.countryList[findCountryRef(country)].deck;
    }
}

function findDeckWithPlayerNumberAndName(playerNumber, deckName) {
    var currentPlayer = gameVars.playerInfo["player" + playerNumber];
        
    for (var i = 0; i < currentPlayer.playerDecklist.length; i++) {
        if (currentPlayer.playerDecklist[i].deckName === deckName) {
            return currentPlayer.playerDecklist[i];
        }
    }
}

function findDeckWithPlayerAndRef(playerNumber, deckRef) {
    return gameVars.playerInfo["player" + playerNumber].playerDecklist[deckRef];
}

function findArrayOfPlayerNames(playerNumberArray) {
    var playerNames = [];

    for (var i = 0; i < playerNumberArray.length; i++) {
        playerNames.push(findPlayerName(playerNumberArray[i]));
    }
    return playerNames;
}

function findPlayerName(playerNumber) {
    return gameVars.playerInfo["player" + playerNumber].playerName;
}

function addMapArea(addToId, idToInclude) {
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");//create a new svg element 

    //add id
    newElement.id = idToInclude;
    //add new element and contents to DOM
    var currentElement = document.getElementById(addToId);
    currentElement.appendChild(newElement);   
}

function addMapElement(addToId, elementContent, idToInclude, classToInclude, clickFunctionToInclude, hoverFunctionToInclude, offHoverFunctionToInclude) {
    var countryArea = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    //country area
    countryArea.setAttributeNS(null, "d", countryShapes[idToInclude].path);
    //add id
    countryArea.id = idToInclude;
    //add functions
    if (!!clickFunctionToInclude && clickFunctionToInclude !== "noFunction") {
        countryArea.onclick = function() { clickFunctionToInclude(countryArea.id); };
    }
    if (!!hoverFunctionToInclude && hoverFunctionToInclude !== "noHover") {
        countryArea.onmouseover = function() { hoverFunctionToInclude(countryArea.id); };
    }
    if (!!offHoverFunctionToInclude && offHoverFunctionToInclude !== "noOffHover") {
        countryArea.onmouseout = function() { offHoverFunctionToInclude(countryArea.id); };
    }
    //add class
    countryArea.classList.add(classToInclude);
    //append path to svg
    document.getElementById(addToId).appendChild(countryArea);
    //country label
    addElement("text-countries", "div", elementContent, idToInclude + "-text", "country-text");
}

function addElement(addToId, elementType, elementContent, idToInclude, classToInclude, clickFunctionToInclude, hoverFunctionToInclude, offHoverFunctionToInclude) {
    var newElement = document.createElement(elementType);//create a new element

    //add class
    if (!!classToInclude && classToInclude !== "noClass") {
        newElement.classList.add(classToInclude);
    }
    //add functions
    if (!!idToInclude && idToInclude !== "noId") {
        newElement.id = idToInclude;

        if (!!clickFunctionToInclude && clickFunctionToInclude !== "noFunction") {
            newElement.onclick = function() { clickFunctionToInclude(idToInclude); };
        }
        if (!!hoverFunctionToInclude && hoverFunctionToInclude !== "noHover") {
            newElement.onmouseover = function() { hoverFunctionToInclude(idToInclude); };
        }
        if (!!offHoverFunctionToInclude && offHoverFunctionToInclude !== "noOffHover") {
            newElement.onmouseout = function() { offHoverFunctionToInclude(idToInclude); };
        }
    }
    //add text
    if (elementContent.indexOf("<") !== 0 && elementContent !== "noContent") {
        //create content node
        newContent = document.createTextNode(elementContent);
        //add text node to new element
        newElement.appendChild(newContent);
    }
    //add new element and contents to DOM
    var currentElement = document.getElementById(addToId);
    currentElement.appendChild(newElement);
    //add html text
    if (elementContent.indexOf("<") === 0) {
        //create innerHTML text
        document.getElementById(idToInclude).innerHTML = elementContent;
    } 
}

function removeElement(parentId, elementId) {
    if (!!document.getElementById(parentId) && document.getElementById(elementId) !== null) {
        document.getElementById(parentId).removeChild(document.getElementById(elementId));
    }
}

function gameCount() {
    var count = 0;

    for (var i = 0; i < gameVars.gameLog.length; i++) {
        var endGameLogs = gameVars.gameLog[i][1].slice(-8);

        if (endGameLogs === "Complete") {
            count += 1;
        }
    }
    return count;
}

function updateLog(text) {
    var logText = [],
    logLength = gameVars.gameLog.length,
    lastLog = gameVars.gameLog[logLength - 1];

    logText.push(Date.parse(Date()));
    for (var i = 0; i < text.length; i++) {
        logText.push(text[i]);
    }
    if (logLength > 0 && lastLog[1].search("Begins") !== -1) {
        logText.push("Game Duration: " + formatDuration(Date.parse(Date()) - lastLog[0]));
    }
    if (logLength > 0 && logText[1].search("Begins") !== -1) {
        logText.push(gameVars.gameStatus.turn);
        logText.push(gameVars.battleScreenInfo.battleDecks);
    }
    gameVars.gameLog.push(logText);
}

function orderArray(array, sortBy) {
    array.sort(function(a, b) {
        if (a[sortBy].toUpperCase() < b[sortBy].toUpperCase()) { return -1; }
        if (a[sortBy].toUpperCase() > b[sortBy].toUpperCase()) { return 1;}
    })
}

function shuffleArray(arrayToShuffle) {
    //Found on stackoverflow
    for (var i = arrayToShuffle.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arrayToShuffle[i];
        arrayToShuffle[i] = arrayToShuffle[j];
        arrayToShuffle[j] = temp;
    }
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function addClass(idToModify, classToAdd) {
    document.getElementById(idToModify).classList.add(classToAdd);
}

function removeClass(idToModify, classToRemove) {
    if (!!idToModify && document.getElementById(idToModify).classList.contains(classToRemove)) {
        document.getElementById(idToModify).classList.remove(classToRemove);
    }
}

function unhideId(id) {
    document.getElementById(id).classList.remove('hide-item-class');
}

function hideId(id) {
    document.getElementById(id).classList.add('hide-item-class');
}

function updateDOMElement(id, text) {
    document.getElementById(id).innerHTML = text;
}

function calcDuration(duration) {
    //parts borrowed from Stack Overflow https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
    let remain = duration;

    let days = Math.floor(remain / (1000 * 60 * 60 * 24));
    remain = remain % (1000 * 60 * 60 * 24);
  
    let hours = Math.floor(remain / (1000 * 60 * 60));
    remain = remain % (1000 * 60 * 60);
  
    let minutes = Math.floor(remain / (1000 * 60));
    remain = remain % (1000 * 60);
  
    let seconds = Math.floor(remain / (1000));
    remain = remain % (1000);
  
    let milliseconds = remain;

    return {
        days, 
        hours, 
        minutes, 
        seconds, 
        milliseconds
    };
}

function formatDuration(duration) {
    var time = calcDuration(duration);

    let days = time.days.toString();
    if (days.length === 1) days = '0' + days;

    let hours = time.hours.toString();
    if (hours.length === 1) hours = '0' + hours;
  
    let minutes = time.minutes.toString();
    if (minutes.length === 1) minutes = '0' + minutes;
  
    let seconds = time.seconds.toString();
    if (seconds.length === 1) seconds = '0' + seconds;
  
    return days + ":" + hours + ":" + minutes + ":" + seconds;
}



//testing functions
function testImages() {
    for (let i = 0; i < vanguardDeck.length; i++) {
        var pictureToShow = vanguardDeck[i].vanguardPicture;
        document.getElementById("card-picture").style.backgroundImage = pictureToShow
    }
    for (let i = 0; i < heroDeck.length; i++) {
        var pictureToShow = heroDeck[i].heroPicture;
        document.getElementById("card-picture").style.backgroundImage = pictureToShow
    }
    for (let i = 0; i < conspiracyDeck.length; i++) {
        var pictureToShow = conspiracyDeck[i].conspiracyPicture;
        document.getElementById("card-picture").style.backgroundImage = pictureToShow
    }
}