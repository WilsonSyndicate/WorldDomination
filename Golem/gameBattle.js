
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
    addElement("planar-choice-menu", "div", "noContent", "planeswalk", "noClass", rollNextPlane);
    addElement("planar-choice-menu", "button", "Cancel", "cancel-prompt", "noClass", cancelPrompt);
    addClass("cancel-prompt", "btn");
    addClass("cancel-prompt", "btn-danger");
}

function poolsChaos() {
    //remove previous choices
    removeElement("planar-choice-menu", "cancel-prompt");
    removeElement("planar-choice-menu", "pools-chaos");
    removeElement("planar-choice-menu", "planeswalk");
    //reveals next 3 cards in a row and puts on bottom
    shufflePlanarDeck();
    //move pools to top front
    if (gameVars.battleScreenInfo.secondPlane.length === 0) {
        gameVars.battleScreenInfo.planarDeck = moveArrayObjectToBeginningOfArray("Pools of Becoming", gameVars.battleScreenInfo.planarDeck);
    }
    else {
        gameVars.battleScreenInfo.planarDeck = moveArrayObjectToBeginningOfArray(gameVars.battleScreenInfo.secondPlane[1], gameVars.battleScreenInfo.planarDeck);
        gameVars.battleScreenInfo.planarDeck = moveArrayObjectToBeginningOfArray(gameVars.battleScreenInfo.secondPlane[0], gameVars.battleScreenInfo.planarDeck);
    }
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
    addElement("planar-choice-menu", "div", "noContent", "pools-chaos", "noClass", poolsChaos);
    addElement("planar-choice-menu", "div", "noContent", "planeswalk", "noClass", rollNextPlane);
    addElement("planar-choice-menu", "button", "Cancel", "cancel-prompt", "noClass", cancelPrompt);
    addClass("cancel-prompt", "btn");
    addClass("cancel-prompt", "btn-danger");
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
    addElement("planar-choice-menu", "button", "Yes", "stairs-yes", "stairs-chaos-yes", stairsChaosYes);
    addClass("stairs-yes", "btn");
    addClass("stairs-yes", "btn-success");
    addElement("planar-choice-menu", "button", "No", "stairs-no", "stairs-chaos-no", stairsChaosNo);
    addClass("stairs-no", "btn");
    addClass("stairs-no", "btn-danger");
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
    addElement("planar-choice-menu", "div", "noContent", "stairs-chaos", "noClass", stairsChaos);
    addElement("planar-choice-menu", "div", "noContent", "planeswalk", "noClass", rollNextPlane);
    addElement("planar-choice-menu", "button", "Cancel", "cancel-prompt", "noClass", cancelPrompt);
    addClass("cancel-prompt", "btn");
    addClass("cancel-prompt", "btn-danger");
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
    addElement("planar-choice-menu", "div", "noContent", "planeswalk", "noClass", tunnelPlaneswalk);
    addElement("planar-choice-menu", "button", "Cancel", "cancel-prompt", "noClass", cancelPrompt);
    addClass("cancel-prompt", "btn");
    addClass("cancel-prompt", "btn-danger");
}

function findNextPlane(planeToKeepOutOfDeck) {
    //shuffle planar deck
    shufflePlanarDeck();
    //move plane to top
    gameVars.battleScreenInfo.planarDeck = moveArrayObjectToBeginningOfArray(planeToKeepOutOfDeck, gameVars.battleScreenInfo.planarDeck);
    //reveal until 1 plane card is found
    for (var p = 1; p < gameVars.battleScreenInfo.planarDeck.length; p++) {
        if (isPlanePhenomenom(gameVars.battleScreenInfo.planarDeck[p]) === false) {
            return gameVars.battleScreenInfo.planarDeck[i];
        }
        else {
            gameVars.battleScreenInfo.currentPlanarCard += 1;
        }
    }
}

function aetherPlaneswalk() {
    //check that next plane is plane
    findNextPlane("Chaotic Aether");
    //display current plane
    rollNextPlane();
    //create second card space
    addElement("battle-information", "div", "noContent", "reveal-chaotic-aether", "noClass");
    //show picture
    document.getElementById("reveal-chaotic-aether").style.backgroundImage = getPlanarPicture("Chaotic Aether");
}

function handleChaoticAether() {
    var planeText = "Planeswalk into the Chaotic Aether?";

    planarPrompt(planeText);
    addElement("planar-choice-menu", "div", "noContent", "planeswalk", "noClass", aetherPlaneswalk);
    addElement("planar-choice-menu", "button", "Cancel", "cancel-prompt", "noClass", cancelPrompt);
}

function findNextTwoPlanes(planeToKeepOutOfDeck) {
    var nextTwoPlanes = [];

    //shuffle planar deck
    shufflePlanarDeck();
    //move plane to top
    gameVars.battleScreenInfo.planarDeck = moveArrayObjectToBeginningOfArray(planeToKeepOutOfDeck, gameVars.battleScreenInfo.planarDeck);
    //find next two planes
    for (var i = 1; i < gameVars.battleScreenInfo.planarDeck.length; i++) {
        if (nextTwoPlanes.length < 2) {
            if (isPlanePhenomenom(gameVars.battleScreenInfo.planarDeck[i]) === false) {
                nextTwoPlanes.push(gameVars.battleScreenInfo.planarDeck[i])
            }
            else {
                gameVars.battleScreenInfo.currentPlanarCard += 1;
            }
        }
    }
    return nextTwoPlanes;
}

function mergingPlaneswalk() {
    //reveal until 2 plane cards are found and go first and next in second card space
    var nextTwoPlanes = findNextTwoPlanes("Spatial Merging");

    //cancel prompt
    cancelPrompt();
    //go to next card
    gameVars.battleScreenInfo.currentPlanarCard += 1;
    //display two current planes
    moveArrayObjectToBeginningOfArray(nextTwoPlanes[0], gameVars.battleScreenInfo.planarDeck);
    moveArrayObjectToBeginningOfArray(nextTwoPlanes[1], gameVars.battleScreenInfo.planarDeck);
    
    //remove plane card spaces
    removeElement("battle-information", "battle-defense-plane2");
    removeElement("battle-information", "reveal-chaotic-aether");
    removeElement("battle-information", "reveal-spatial-merging");
    //clear prompt menu
    cancelPrompt();
    //save second plane name
    gameVars.battleScreenInfo.secondPlane.push(nextTwoPlanes[0]);
    gameVars.battleScreenInfo.secondPlane.push(nextTwoPlanes[1]);
    //go to next card
    gameVars.battleScreenInfo.currentPlanarCard += 1;
    //show picture
    document.getElementById("battle-defense-plane").style.backgroundImage = getPlanarPicture(nextTwoPlanes[1]);
    //create second card space
    addElement("battle-information", "div", "noContent", "reveal-spatial-merging", "noClass", secondPlaneChaosRoll);
    //show second picture
    document.getElementById("reveal-spatial-merging").style.backgroundImage = getPlanarPicture(nextTwoPlanes[0]);
}

function handleSpatialMerging() {  
    var planeText = "Planeswalk into the next two planes Spatial Merging?";

    planarPrompt(planeText);
    addElement("planar-choice-menu", "div", "noContent", "planeswalk", "noClass", mergingPlaneswalk);
    addElement("planar-choice-menu", "button", "Cancel", "cancel-prompt", "noClass", cancelPrompt);   
}

function shufflePlanarDeck(plane) {
    var currentGroundZero = gameVars.battleScreenInfo.groundZero,
    groundZeroContinent = findCountryContinent(currentGroundZero),
    newPlanarDeck = [],
    possiblePhenomenomDeck = [];

    //reset current planar card
    gameVars.battleScreenInfo.currentPlanarCard = 0;
    //first shuffle
    if (gameVars.battleScreenInfo.planarDeck.length === 0) {
        //push continent planes
        for (var i = 0; i < planarDeck.length; i++) {
            if (planarDeck[i].planeContinent === groundZeroContinent && planarDeck[i].planeName !== plane.planeName) {
                newPlanarDeck.push(planarDeck[i].planeName);
            }
        }
        //push random phenomenom
        for (var p = 0; p < phenomenomDeck.length; p++) {
            if (isItemInArray(phenomenomDeck[p].planeName, newPlanarDeck) === false) {
                possiblePhenomenomDeck.push(phenomenomDeck[p].planeName);
            }
        }
        shuffleArray(possiblePhenomenomDeck);
        if (possiblePhenomenomDeck.length > 0) {
            newPlanarDeck.push(possiblePhenomenomDeck[0]);
        }
        //shuffle planar deck
        shuffleArray(newPlanarDeck);
        //saves planar deck
        if (findPlaneContinent(plane.planeName) === findCountryContinent(currentGroundZero)) {//start in plane
            var planarDeckToUse = [];
            
            //push defense plane
            planarDeckToUse.push(plane.planeName);
            //push rest of shuffled planar deck
            for (var d = 0; d < newPlanarDeck.length; d++) {
                planarDeckToUse.push(newPlanarDeck[d]);
            }
            //update planar deck
            gameVars.battleScreenInfo.planarDeck = planarDeckToUse;
        }
        else {//start in random
            //push defense plane
            newPlanarDeck.push(plane.planeName);
            //shuffle planar deck
            shuffleArray(newPlanarDeck);
            //update planar deck
            gameVars.battleScreenInfo.planarDeck = newPlanarDeck;
        }
    }
    //ongoing shuffle
    else {
        //add phenomenom
        for (var c = 0; c < phenomenomDeck.length; c++) {
            if (isItemInArray(phenomenomDeck[c].planeName, gameVars.battleScreenInfo.planarDeck) === false) {
                possiblePhenomenomDeck.push(phenomenomDeck[c].planeName);
            }
        }
        if (possiblePhenomenomDeck.length > 0) {
            shuffleArray(possiblePhenomenomDeck);
            gameVars.battleScreenInfo.planarDeck.push(possiblePhenomenomDeck[0]);
        }
        //shuffle planar deck and reset current card
        shuffleArray(gameVars.battleScreenInfo.planarDeck);
        //show picture
        document.getElementById("battle-defense-plane").style.backgroundImage = getPlanarPicture(gameVars.battleScreenInfo.planarDeck[0]);
    }
}

function shuffleNoteText(plane) {
    var currentGroundZero = gameVars.battleScreenInfo.groundZero,
    groundZeroContinent = findCountryContinent(currentGroundZero);

    if (findPlaneContinent(plane.planeName) === findCountryContinent(currentGroundZero)) {
        return "Start in " + plane.planeName + ", and shuffle the " + groundZeroContinent + " planes and add a phenomenon";
    }
    else {
        return "Start in a random plane and shuffle " + plane.planeName + " in with the " + groundZeroContinent + " planes and add a phenomenon";
    }
}

function createDefensePlane() {
    var defendingPlayerDeck = gameVars.battleScreenInfo.battleDecks[1];

    //do this if deck has defense plane
    if (gameVars.gameStatus.mode === "attack" && !!findFullDeckWithPlayerAndName(defendingPlayerDeck.deckPlayer, defendingPlayerDeck.deckName).defensePlane) {
        var defensePlaneRef = findDefensePlaneRefWithPlayerAndDeckName(defendingPlayerDeck.deckPlayer, defendingPlayerDeck.deckName);

        //create the element
        addElement("battle-information", "div", "noContent", "battle-defense-plane", "noClass", planarChaosRoll);
        //plane shuffle note
        document.getElementById("battle-note").innerHTML = shuffleNoteText(planarDeck[defensePlaneRef])
        //create planar deck
        shufflePlanarDeck(planarDeck[defensePlaneRef]);
        //show picture
        document.getElementById("battle-defense-plane").style.backgroundImage = getPlanarPicture(gameVars.battleScreenInfo.planarDeck[gameVars.battleScreenInfo.currentPlanarCard]);
    }
}

function getPlanarPicture(planeName) {
    for (var i = 0; i < planarDeck.length; i++) {
        if (planarDeck[i].planeName === planeName) {
            return planarDeck[i].planePicture;
        }
    }
    for (var p = 0; p < phenomenomDeck.length; p++) {
        if (phenomenomDeck[p].planeName === planeName) {
            return phenomenomDeck[p].planePicture;
        }
    }
}

function secondPlaneChaosRoll() {
    var secondPlaneName = gameVars.battleScreenInfo.secondPlane[0];
    
    //add exceptions for special cards
    switch (secondPlaneName) {
        case "Pools of Becoming":
            handlePoolsOfBecoming();
            break;
        case "Stairs to Infinity":
            handleStairsToInfinity();
            break;
        default:
            handleNormalPlanePrompt();
    }
}

function planarChaosRoll() {
    if (gameVars.battleScreenInfo.secondPlane.length === 0) {
        var currentPlaneName = gameVars.battleScreenInfo.planarDeck[gameVars.battleScreenInfo.currentPlanarCard];
    }
    else {
        var currentPlaneName = gameVars.battleScreenInfo.secondPlane[1];
    }
    //add exceptions for special cards
    switch (currentPlaneName) {
        case "Pools of Becoming":
            handlePoolsOfBecoming();
            break;
        case "Stairs to Infinity":
            handleStairsToInfinity();
            break;
        case "Chaotic Aether":
            handleChaoticAether();
            break;
        case "Interplanar Tunnel":
            handleInterplanarTunnel();
            break;
        case "Spatial Merging":
            handleSpatialMerging();
            break;
        default:
            handleNormalPlanePrompt();
    }
}

function rollNextPlane() {
    //hide prompt
    addClass("planar-prompt", "hide-item-class");
    if (gameVars.battleScreenInfo.planarDeck.length === gameVars.battleScreenInfo.currentPlanarCard + 1) {
        //reshuffle
        shufflePlanarDeck();
    }
    else {
        //go to next card
        gameVars.battleScreenInfo.currentPlanarCard += 1;
        //show picture
        document.getElementById("battle-defense-plane").style.backgroundImage = getPlanarPicture(gameVars.battleScreenInfo.planarDeck[gameVars.battleScreenInfo.currentPlanarCard]);
    }
    //remove plane card spaces (only remove when a planeswalk is walked from for spatial merging)
    removeElement("battle-information", "battle-defense-plane2");
    removeElement("battle-information", "reveal-chaotic-aether");
    removeElement("battle-information", "reveal-spatial-merging");
    gameVars.battleScreenInfo.secondPlane = [];
    //clear prompt menu
    cancelPrompt();
}

function battleHoverLifeText(battleDeckReference) {
    var lifeText = "Life Tally:";

    for (var i = 0; i < gameVars.battleScreenInfo.battleLifeMods[battleDeckReference].length; i++) {
        lifeText += "<br>" + gameVars.battleScreenInfo.battleLifeMods[battleDeckReference][i];
    }
    return lifeText;
}

function battleHoverHandText(battleDeckReference) {
    var handText = "Hand Tally:";

    for (var i = 0; i < gameVars.battleScreenInfo.battleHandMods[battleDeckReference].length; i++) {
        handText += "<br>" + gameVars.battleScreenInfo.battleHandMods[battleDeckReference][i];
    }
    return handText;
}

function battleHoverContinentText(currentPlayer, battleDeckReference) {
    var hoverText = "Continent Bonus",
    continentsBon = gameVars.battleScreenInfo.battleContinentBonuses[battleDeckReference];

    for (var i = 0; i < continentsBon.length; i++) {
        var currentContinent = continentsBon[i];

        hoverText += " <br> " + currentContinent + ": " + adminSettings.continentBonuses["bonus" + currentContinent];
        if (currentContinent === "North America") {
            hoverText += adminSettings.continentBonuses.continentLifeBonus + ".";
        }
        if (currentContinent === "Europe") {
            var totalPlayerDeckCount = playerDeckCount(currentPlayer),
            cardsToAdd = Math.floor(adminSettings.continentBonuses.continentCardPerDeckBonus * totalPlayerDeckCount);

            if (cardsToAdd < adminSettings.continentBonuses.continentCardMinimum) {
                cardsToAdd = adminSettings.continentBonuses.continentCardMinimum;
            }
            hoverText += cardsToAdd + ".";
        }
    }
    return hoverText;
}

function battlePictureOffHover(mod) {
    if (gameVars.gameStatus.mode === "attack") {
        document.getElementById("card-picture").innerHTML = "";
        removeClass("card-picture", "player-color-1");
        removeClass("card-picture", "player-color-2");
        removeClass("card-picture", "player-color-3");
        removeClass("card-picture", "player-color-4");
        removeClass("card-picture", "player-color-5");
        removeClass("card-picture", "toolbar");
    }
}

function battlePictureHover(mod) {
    var battleDeckReference = mod.charAt(mod.length - 1),
    pictureType = mod.slice(0, -1),
    currentPlayer = gameVars.battleScreenInfo.battleDecks[battleDeckReference].deckPlayer;

    if (gameVars.gameStatus.mode === "attack") {
        if (pictureType === "vanguard" && pictureType !== "noVanguard") {
            var vanguardToShowName = gameVars.battleScreenInfo.battleVanguards[battleDeckReference],
            vanguardRef = findVanguardRef(vanguardToShowName),
            pictureToShow = vanguardDeck[vanguardRef].vanguardPicture;

            document.getElementById("card-picture").innerHTML = "";
            document.getElementById("card-picture").style.backgroundImage = pictureToShow;
        } 
        else if (pictureType === "hero" && pictureType !== "noHero") {
            var heroToShowName = gameVars.battleScreenInfo.battleHero[battleDeckReference],
            heroRef = findHeroRef(heroToShowName),
            pictureToShow = heroDeck[heroRef].heroPicture;

            document.getElementById("card-picture").innerHTML = "";
            document.getElementById("card-picture").style.backgroundImage = pictureToShow;
        } 
        else if (pictureType === "conspiracy" && pictureType !== "noConspiracy") {
            var conspiracyToShowName = gameVars.battleScreenInfo.battleConspiracy[battleDeckReference],
            conspiracyRef = findConspiracyRef(conspiracyToShowName),
            pictureToShow = conspiracyDeck[conspiracyRef].conspiracyPicture;

            document.getElementById("card-picture").innerHTML = "";
            document.getElementById("card-picture").style.backgroundImage = pictureToShow;
        }
        else if (pictureType ==="continent-bonus" && pictureType !== "noContinent") {
            var continentText = battleHoverContinentText(currentPlayer, battleDeckReference);

            for (i = 1; i < 6; i++) {
                removeClass("card-picture", 'player-color-' + i);
            }
            removeClass("card-picture", "toolbar");
            document.getElementById("card-picture").style.backgroundImage = "none";
            addClass("card-picture", "player-color-" + currentPlayer);
            addClass("card-picture", "toolbar");
            document.getElementById("card-picture").innerHTML = continentText;
        }
        else if (pictureType === "beginning-life") {
            var lifeText = battleHoverLifeText(battleDeckReference);

            for (i = 1; i < 6; i++) {
                removeClass("card-picture", 'player-color-' + i);
            }
            removeClass("card-picture", "toolbar");
            document.getElementById("card-picture").style.backgroundImage = "none";
            addClass("card-picture", "player-color-" + currentPlayer);
            addClass("card-picture", "toolbar");
            document.getElementById("card-picture").innerHTML = lifeText;
        }
        else if (pictureType === "hand-size") {
            var handText = battleHoverHandText(battleDeckReference);

            for (i = 1; i < 6; i++) {
                removeClass("card-picture", 'player-color-' + i);
            }
            removeClass("card-picture", "toolbar");
            document.getElementById("card-picture").style.backgroundImage = "none";
            addClass("card-picture", "player-color-" + currentPlayer);
            addClass("card-picture", "toolbar");
            document.getElementById("card-picture").innerHTML = handText;
        }
    }
}

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
    var lifeTotal = 20,
    lifeTotalMods = [];

    lifeTotalMods.push("Unmodified Life: 20");
    for (var b = 0; b < bonuses.length; b++) {
        if (bonuses[b] === 0) {
            lifeTotal += adminSettings.gameBonuses[0].life;
        }
        lifeTotalMods.push(b + " Life Bonuses: +" + adminSettings.gameBonuses[0].life);
    }
    for (var p = 0; p < penalties.length; p++) {
        if (penalties[p] === 0) {
            lifeTotal += adminSettings.gamePenalties[0].life;
        }
        lifeTotalMods.push(p + " Life Penalties: -" + adminSettings.gamePenalties[0].life);
    }
    //hero
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleHero[battleDeckRef] !== "noHero") {
        lifeTotal += findFullHeroWithName(gameVars.battleScreenInfo.battleHero[battleDeckRef]).heroLife;

        lifeTotalMods.push("Hero Life: +" + findFullHeroWithName(gameVars.battleScreenInfo.battleHero[battleDeckRef]).heroLife);
    }
    //vanguard
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleVanguards[battleDeckRef] !== "noVanguard") {
        var vanguardRef = findVanguardRef(gameVars.battleScreenInfo.battleVanguards[battleDeckRef]);

        lifeTotal += vanguardDeck[vanguardRef].vanguardLife;
        if (vanguardDeck[vanguardRef].vanguardLife < 0) {
            lifeTotalMods.push("Vanguard Life: " + vanguardDeck[vanguardRef].vanguardLife);
        }
        else {
            lifeTotalMods.push("Vanguard Life: +" + vanguardDeck[vanguardRef].vanguardLife);
        }
    }
    //country support
    if (adminSettings.supportBonus.useSupportBonusInGame === true && gameVars.gameStatus.mode !== "setup" && countrySupport[0] !== 0) {
        if (countrySupport[1] === true) {
            lifeTotal += Math.floor(adminSettings.supportBonus.defendingLife * countrySupport[0]);
            lifeTotalMods.push(countrySupport[0] + " Defense Support Bonuses: +" + Math.floor(adminSettings.supportBonus.defendingLife * countrySupport[0]));
        }
        else {
            lifeTotal += Math.floor(adminSettings.supportBonus.attackingLife * countrySupport[0]);
            lifeTotalMods.push(countrySupport[0] + " Attack Support Bonuses: +" + Math.floor(adminSettings.supportBonus.attackingLife * countrySupport[0]));
        }
    }
    //continent bonus
    if (gameVars.gameStatus.mode === "attack" && adminSettings.continentBonuses.useContinentBonuses === true && isItemInArray("North America", [gameVars.battleScreenInfo.battleContinentBonuses[battleDeckRef]]) && gameVars.battleScreenInfo.battleContinentBonuses[battleDeckRef] !== "noContinent") {
        lifeTotal += adminSettings.continentBonuses.continentLifeBonus;
        lifeTotalMods.push("Continent Bonus: +" + adminSettings.continentBonuses.continentLifeBonus);
    }
    lifeTotalMods.push("Starting Life: " + lifeTotal);
    gameVars.battleScreenInfo.battleLifeMods.push(lifeTotalMods);
    return ["Beginning Life Total: ", lifeTotal, "beginning-life"];
}

function countBattleHand(bonuses, penalties, countrySupport, battleDeckRef) {
    var handTotal = 7,
    handTotalMods = [];

    handTotalMods.push("Unmodified Hand: 7");
    for (var b = 0; b < bonuses.length; b++) {
        if (bonuses[b] === 1) {
            handTotal += adminSettings.gameBonuses[1].hand;
        }
        handTotalMods.push(b + " Hand Bonuses: +" + adminSettings.gameBonuses[0].hand);
    }
    for (var p = 0; p < penalties.length; p++) {
        if (penalties[p] === 1) {
            handTotal += adminSettings.gamePenalties[1].hand;
        }
        handTotalMods.push(p + " Hand Penalties: +" + adminSettings.gamePenalties[0].hand);
    }
    //hero
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleHero[battleDeckRef] !== "noHero") {
        handTotal += findFullHeroWithName(gameVars.battleScreenInfo.battleHero[battleDeckRef]).heroHand;
        handTotalMods.push("Hero Hand: +" + findFullHeroWithName(gameVars.battleScreenInfo.battleHero[battleDeckRef]).heroHand);
    }
    //vanguard
    if (gameVars.gameStatus.mode === "attack" && gameVars.battleScreenInfo.battleVanguards[battleDeckRef] !== "noVanguard") {
        var vanguardRef = findVanguardRef(gameVars.battleScreenInfo.battleVanguards[battleDeckRef]);

        handTotal += vanguardDeck[findVanguardRef(gameVars.battleScreenInfo.battleVanguards[battleDeckRef])].vanguardHand;
        if (vanguardDeck[findVanguardRef(gameVars.battleScreenInfo.battleVanguards[battleDeckRef])].vanguardHand < 0) {
            handTotalMods.push("Vanguard Hand: " + vanguardDeck[vanguardRef].vanguardHand);
        }
        else {
            handTotalMods.push("Vanguard Hand: +" + vanguardDeck[vanguardRef].vanguardHand);
        }
    }
    //country support
    if (adminSettings.supportBonus.useSupportBonusInGame === true && gameVars.gameStatus.mode !== "setup" && countrySupport[0] !== 0) {
        if (countrySupport[1] === true) {
            handTotal += Math.floor(adminSettings.supportBonus.defendingHand * countrySupport[0]);
            handTotalMods.push(countrySupport[0] + " Defense Support Bonuses: +" + Math.floor(adminSettings.supportBonus.defendingHand * countrySupport[0]));
        }
        else {
            handTotal += Math.floor(adminSettings.supportBonus.attackingHand * countrySupport[0]);
            handTotalMods.push(countrySupport[0] + " Attacking Support Bonuses: +" + Math.floor(adminSettings.supportBonus.attackingHand * countrySupport[0]));
        }
    }
    //continent bonus
    if (gameVars.gameStatus.mode === "attack" && adminSettings.continentBonuses.useContinentBonuses === true && isItemInArray("Europe", [gameVars.battleScreenInfo.battleContinentBonuses[battleDeckRef]]) && gameVars.battleScreenInfo.battleContinentBonuses[battleDeckRef] !== "noContinent") {
        var currentPlayer = gameVars.battleScreenInfo.battleDecks[battleDeckRef],
        currentPlayerDeckCount = playerDeckCount(currentPlayer),
        cardsToAdd = Math.floor(adminSettings.continentBonuses.continentCardPerDeckBonus * currentPlayerDeckCount);

        if (cardsToAdd < adminSettings.continentBonuses.continentCardMinimum) {
            handTotal += adminSettings.continentBonuses.continentCardMinimum;
            handTotalMods.push("Continent Bonus: " + adminSettings.continentBonuses.continentCardMinimum);
        }
        else {
            handTotal += cardsToAdd;
            handTotalMods.push("Continent Bonus: " + cardsToAdd);
        }
    }
    handTotalMods.push("Starting and Max Hand Size: " + handTotal);
    gameVars.battleScreenInfo.battleHandMods.push(handTotalMods);
    return ["Opening & Max Hand Size: ", handTotal, "hand-size"];
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
        return ["Your Creatures Get: ", creatureMod, "power-and-toughness"]
    }
}

function battleVanguard(battleDeckRef) {
    if (gameVars.gameStatus.mode === "setup" || gameVars.battleScreenInfo.battleVanguards[battleDeckRef] === "noVanguard") {
        return "";
    }
    else {
        return ["Vanguard: ", gameVars.battleScreenInfo.battleVanguards[battleDeckRef], "vanguard"];
    }
}

function continentBonuses(battleDeckRef) {
    if (adminSettings.continentBonuses.useContinentBonuses && gameVars.gameStatus.mode === "attack") {
        var currentPlayer = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deckPlayer,
        currentDeckName = gameVars.battleScreenInfo.battleDecks[battleDeckRef].deckName,
        currentDeckColors = getDeckColors(currentPlayer, currentDeckName),
        continentBonuses = [],
        groundZero = gameVars.battleScreenInfo.groundZero,
        groundZeroColor = adminSettings.continentBonuses[findContinentWithCountry(groundZero)],
        controlledContinents = listControlledContinentsWithPlayerAndColor(currentPlayer, currentDeckColors),
        ownedContinents = listOwnedContinentsWithPlayerAndColor(currentPlayer, currentDeckColors),
        bonusText = "",
        battleContBonus = [];
    
        //add ground zero if color matches
        if (colorOnList(groundZeroColor, currentDeckColors)) {
            continentBonuses.push(findContinentWithCountry(groundZero));
        }
        //add owned continents with color match
        for (var o = 0; o < ownedContinents.length; o++) {
            continentBonuses.push(ownedContinents[o]);
        }
        //add controlled continents with color match
        for (var c = 0; c < controlledContinents.length; c++) {
            continentBonuses.push(controlledContinents[c]);
        }
        //return bonus or blank
        if (continentBonuses.length === 0) {
            gameVars.battleScreenInfo.battleContinentBonuses.push("noContinent");
            return "";
        }
        else {
            //remove duplicates from ownedContinents list
            continentBonuses = findUniqueValuesInArray(continentBonuses);
            //build bonus text
            for (var i = 0; i < continentBonuses.length; i++) {
                if (i === 0) {
                    battleContBonus.push(continentBonuses[i]);
                    bonusText += continentBonuses[i];
                }
                else {
                    battleContBonus.push(continentBonuses[i]);
                    bonusText += ", " + continentBonuses[i];
                }
            }
            gameVars.battleScreenInfo.battleContinentBonuses.push(battleContBonus);
            return ["Continent Bonus: ", bonusText, "continent-bonus"];
        }
    }
    else {
        return "";
    }
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
                gameVars.mapInfo.heroConspiracyPlayed.push(currentHero);
                return ["Hero: ", currentHero, "hero"];
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
                gameVars.mapInfo.heroConspiracyPlayed.push(currentConspiracy);
                return ["Conspiracy: ", currentConspiracy, "conspiracy"];
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
        //add card picture element
        addElement("battle-information", "div", "noContent", "card-picture");
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
        if (adminSettings.useDefensePlane) {
            defensePlanePrompt();
        }
        else {
            //go to battle screen 
            showBattle();
            //update battle message and note
            document.getElementById("battle-message").innerHTML = countGames + " Battle Game for " + groundZero;
            //remove supply drop button
            removeElement("map-screen-toolbar", "supply-drop-button");
        }
    }
}

function defensePlanePrompt() {
    var defendingDeck = gameVars.battleScreenInfo.battleDecks[1],
    groundZero = findFullCountryWithCountry(gameVars.battleScreenInfo.groundZero).countryName,
    countGames = numberSuffix(gameCount()),
    playerName = findPlayerName(defendingDeck.deckPlayer),
    defensePromptText = playerName + " choose Defense Plane for " + defendingDeck.deckName + " defending " + groundZero;

    if (!!findFullDeckWithPlayerAndName(defendingDeck.deckPlayer, defendingDeck.deckName).defensePlane) {
        //go to battle screen 
        showBattle();
        //update battle message and note
        document.getElementById("battle-message").innerHTML = countGames + " Battle Game for " + groundZero;
        //remove supply drop button
        removeElement("map-screen-toolbar", "supply-drop-button");
    }
    else {
        //unhide defense prompt
        unhideId("defense-plane-prompt");
        //update defense prompt note
        document.getElementById("defense-choice-text").innerHTML = defensePromptText;
        //save plane prompt text
        gameVars.battleScreenInfo.planePromptText = defensePromptText;
        //build defense plane buttons
        buildDefensePlaneButtons(defendingDeck.deckPlayer);
    }
}

function buildDefensePlaneButtons(defensePlayer) {
    //update defense prompt color
    for (var i = 1; i < 6; i++) {
        removeClass("defense-choice-box", "defense-color-" + i);  
    }
    addClass("defense-choice-box", "defense-color-" + defensePlayer);
    //build defense plane buttons without phenomenoms
    for (var i = 0; i < planarDeck.length; i++) {
        var currentPlaneName = planarDeck[i].planeName,
        planeColor = findContinentColor(planarDeck[i].planeContinent).toLowerCase();
        
        removeElement("defense-plane-buttons", "plane-ref-" + i);
        addElement("defense-plane-buttons", "button", currentPlaneName, "plane-ref-" + i, "btn", planePromptChoice, planeOnHover);
        //update button color
        addClass("plane-ref-" + i, "plane-color-" + planeColor);

        //check plane for already taken
        if (countPlaneNameUsedByPlayer(currentPlaneName, defensePlayer) ===  playerHighestPlaneCount(defensePlayer)) {
            //mark as taken
            addClass("plane-ref-" + i, "taken");
            //disable
            disableId("plane-ref-" + i);
        }
    }
}

function countPlaneNameUsedByPlayer(planeName, player) {
    var planeCount = 0;

    for (var d = 0; d < gameVars.playerInfo["player" + player].playerDecklist.length; d++) {
        var currentDeck = gameVars.playerInfo["player" + player].playerDecklist[d];

        if (!!currentDeck.defensePlane && currentDeck.defensePlane === planeName) {
            planeCount += 1;
        }
    }
    return planeCount;
}

function playerHighestPlaneCount(player) {
    var planeCount = 0,
    planeCountTally = [];

    for (var p = 0; p < planarDeck.length; p++) {
        var currentPlane = planarDeck[p].planeName,
        currentPlaneCount = 0;

        for (var d = 0; d < gameVars.playerInfo["player" + player].playerDecklist.length; d++) {
            var currentDeck = gameVars.playerInfo["player" + player].playerDecklist[d];
            
            if (!!currentDeck.defensePlane && currentDeck.defensePlane === currentPlane) {
                currentPlaneCount += 1;
            }
        }
        //record running total of decks this plane is in on given player
        planeCountTally.push(currentPlaneCount);
        //record if it is the highest number of decks use this plane on given player
        if (currentPlaneCount > planeCount) {
            planeCount = currentPlaneCount;
        }
    }
    //if they are all the same return 1 more
    if (findUniqueValuesInArray(planeCountTally).length === 1) {
        planeCount += 1;
    }
    return planeCount;
}

function planeOnHover(planeRef) {
    var actualPlaneRef = planeRef.slice(10),
    takenDeckNames = findDefenseDecks(gameVars.battleScreenInfo.battleDecks[1].deckPlayer, planarDeck[actualPlaneRef].planeName);
    //show picture
    document.getElementById("defense-preview").style.backgroundImage = planarDeck[actualPlaneRef].planePicture;
    //display current deck if taken
    if (takenDeckNames.length === 0) {
        document.getElementById("defense-preview").innerHTML = "";
        document.getElementById("defense-choice-text").innerHTML = gameVars.battleScreenInfo.planePromptText;
    }
    else {
        var takenDeckNameText = "";

        for (var i = 0; i < takenDeckNames.length; i++) {
            if (i === 0) {
                takenDeckNameText += findDefenseDecks(playerNumber, defenseName);
            }
            else if (i === takenDeckNames.length - 1) {
                takenDeckNameText += ", and " + findDefenseDecks(playerNumber, defenseName);
            }
            else {
                takenDeckNameText += ", " + findDefenseDecks(playerNumber, defenseName);
            }
        }
        document.getElementById("defense-choice-text").innerHTML = "This plane is assigned to " + takenDeckNameText;
    }
}

function addDefensePlaneToDeck(planeRef) {
    const deckPlayer = gameVars.battleScreenInfo.battleDecks[1].deckPlayer,
    deckName = gameVars.battleScreenInfo.battleDecks[1].deckName,
    deckToAddTo = findDeckWithPlayerNumberAndName(deckPlayer, deckName),
    defenseToAdd = planarDeck[planeRef].planeName;

    deckToAddTo["defensePlane"] = defenseToAdd;
}

function planePromptChoice(planeRef) {
    var groundZero = findFullCountryWithCountry(gameVars.battleScreenInfo.groundZero).countryName,
    actualPlaneRef = planeRef.slice(10),
    countGames = numberSuffix(gameCount());

    //hide defense prompt
    hideId("defense-plane-prompt");
    //add plane info to deck
    addDefensePlaneToDeck(actualPlaneRef)
    //go to battle screen 
    showBattle();
    //update battle message and note
    document.getElementById("battle-message").innerHTML = countGames + " Battle Game for " + groundZero;
    //remove supply drop button
    removeElement("map-screen-toolbar", "supply-drop-button");
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
    gameVars.battleScreenInfo.battleContinentBonuses = [];
    gameVars.battleScreenInfo.battleLifeMods = [];
    gameVars.battleScreenInfo.battleHandMods = [];
    gameVars.battleScreenInfo.planePromptText = "";
    gameVars.battleScreenInfo.planarDeck = [];
    gameVars.battleScreenInfo.currentPlanarCard = 0;
    removeElement("country-information", "map-defense-preview");
    //remove defense plane
    removeElement("battle-information", "battle-defense-plane");
    //clear deck info and buttons
    clearBattleScreenInformation();
    //cleanup continent owned and controlled list
    cleanupContinentOwnedList();
    cleanupContinentControlledList();
    //cleanup hero and conspiracy played list
    cleanupHeroAndConspiracy();
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
    deckToEliminate.deckEliminated = true;
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
        
        //clear card picture
        removeElement("battle-information", "card-picture");
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
            gameVars.battleScreenInfo.battleContinentBonuses = [];
            gameVars.battleScreenInfo.battleLifeMods = [];
            gameVars.battleScreenInfo.battleHandMods = [];
            gameVars.battleScreenInfo.planePromptText= "";
            gameVars.battleScreenInfo.planarDeck = [];
            gameVars.battleScreenInfo.currentPlanarCard = 0;
            removeElement("country-information", "map-defense-preview");
            //remove defense plane
            removeElement("battle-information", "battle-defense-plane");
            showMap();
            buildMapButtons();
            if (winningPlayerId !== gameVars.gameStatus.turn) {  
                earthShakingEventCheck();
            }
            //check for player eliminated and end of game
            eliminatedPlayerCheck(winningDeck, battleDefender);
            //cleanup continent owned and controlled list
            cleanupContinentOwnedList();
            cleanupContinentControlledList();
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
    currentDeckRef = findDeckRef(currentPlayer, currentDeckName),
    currentDeckColor = findDeckWithPlayerAndRef(currentPlayer, currentDeckRef).deckColors,
    battleText = [
        currentPlayerName + " playing " + currentDeckName + " (" + currentDeckColor + ")"
    ],
    countrySupport = findCountrySupport(currentPlayer),
    penalties = findDeckPenalties(currentPlayer, currentDeckName),
    bonuses = findDeckBonuses(currentPlayer, currentDeckName),
    gameMods = [
        battleVanguard(battleDeckRef),
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

            addElement("battle-player" + battleDeckRef, "h6", gameModsCurrentText, gameMods[d][2] + battleDeckRef, "small", "noFunction", battlePictureHover, battlePictureOffHover);
        }
    }
    //create buttons
    addElement("battle-player" + battleDeckRef, "button", currentPlayerName, "battle-winner-" + currentPlayer, "player-color-" + currentPlayer, battleWinner);
    //add btn class to button
    addClass("battle-winner-" + currentPlayer, "btn");
    //add win-button class to button
    addClass("battle-winner-" + currentPlayer, "win-button");
}