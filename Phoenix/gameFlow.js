

//Battle

function createBattleScreenInfo(plNum) {
    gameVars.battleScreenInfo.battleDeck["Player" + plNum] = {
        playerNumber: plNum,
        deck: "",
        gameStarts: {
            life: 20,
            hand: 7
        },
        attacker: false,
        defender: false,
        country: "",
        continentBonus: "",
        vanguard: "",
        supportCountries: 0,
        bonuses: 0,
        penalties: 0,
        hero: "",
        conspiracy: "",
        defensePlane: ""

    };
}

function loadBattleScreenDecks(plNum) {
   if (gameVars.gameStatus.mode === "setup") {
       var iniDeck = gameVars.playerInfo["Player" + plNum].gameDeckRandomLibrary[0];

       gameVars.battleScreenInfo.battleDeck["Player" + plNum].deck = iniDeck;
        updateBattleLog("Initiative Game Begins");
   }
   else {
    displayBattleLocationInfo();
       //check if playing in this battle
       //add regular battle info
   }
}




function displayBattlePlayerInfo(plNum) {
    var displayName = gameVars.playerInfo["Player" + plNum].name,
    displayDeckName = gameVars.battleScreenInfo.battleDeck["Player" + plNum].deck.deckName,
    displayDeckColor = gameVars.battleScreenInfo.battleDeck["Player" + plNum].deck.deckColor,
    displayLife = gameVars.battleScreenInfo.battleDeck["Player" + plNum].gameStarts.life,
    displayHand = gameVars.battleScreenInfo.battleDeck["Player" + plNum].gameStarts.hand,
    displayAttacker = gameVars.battleScreenInfo.battleDeck["Player" + plNum].attacker,
    displayDefender = gameVars.battleScreenInfo.battleDeck["Player" + plNum].defender,
    displayContinentBonuses = gameVars.battleScreenInfo.battleDeck["Player" + plNum].continentBonus,
    displayVanguard = gameVars.battleScreenInfo.battleDeck["Player" + plNum].vanguard,
    displayBonuses = gameVars.battleScreenInfo.battleDeck["Player" + plNum].bonuses,
    displayPenalties = gameVars.battleScreenInfo.battleDeck["Player" + plNum].penalties,
    displayHero = gameVars.battleScreenInfo.battleDeck["Player" + plNum].hero,
    displayConspiracy = gameVars.battleScreenInfo.battleDeck["Player" + plNum].conspiracy,
    displayDefensePlane = gameVars.battleScreenInfo.battleDeck["Player" + plNum].defensePlane;



//create a div to hold plNum display
//add each piece of info if there is anything to display
//add a win button for each with a shared class and unique id






console.log(displayName + " \nDeck: " + displayDeckName + " Color " + 
displayDeckColor + " \nLife " + displayLife + " Hand " + displayHand);

}




function displayBattleLocationInfo() {
    //set ground zero and display 


}


function openBattleScreen() {
    var numberOfPlayers = gameVars.battleScreenInfo.playersInBattleCount.length;

    displayBattleLocationInfo()
    for (var i = 0; i < numberOfPlayers; i++) {
        var plNum = gameVars.battleScreenInfo.playersInBattleCount[i];

        createBattleScreenInfo(plNum);
        loadBattleScreenDecks(plNum);
        displayBattlePlayerInfo(plNum);
    }
    addClass("battle-screen", "battle-screen-background-class");



    console.log(gameVars.battleScreenInfo);

    console.log("Display winner buttons");

}




//Task Masters

function addClass(idToModify, classToAdd) {
    document.getElementById(idToModify).classList.add(classToAdd);
}

function removeClass(idToModify, classToRemove) {
    document.getElementById(idToModify).classList.remove(classToRemove);
}

function updateBattleLog (situationText) {
    battleText = "Player and deck info from battleScreenInfo";



    updateLog(battleText)
}