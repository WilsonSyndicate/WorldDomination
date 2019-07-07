

//Battle

function createBattleScreenInfo(plNum) {
    battleScreenInfo["Player" + plNum] = {
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
   if (gameStatus.mode === "setup") {
       var iniDeck = playerInfo["Player" + plNum].gameDeckRandomLibrary[0];

        battleScreenInfo["Player" + plNum].deck = iniDeck;
   }
   else {
       //check if playing in this battle
       //add regular battle info
   }
}




function displayBattlePlayerInfo(plNum) {
    var displayName = playerInfo["Player" + plNum].name,
    displayDeckName = battleScreenInfo["Player" + plNum].deck.deckName,
    displayDeckColor = battleScreenInfo["Player" + plNum].deck.deckColor,
    displayLife = battleScreenInfo["Player" + plNum].gameStarts.life,
    displayHand = battleScreenInfo["Player" + plNum].gameStarts.hand,
    displayAttacker = battleScreenInfo["Player" + plNum].attacker,
    displayDefender = battleScreenInfo["Player" + plNum].defender,
    displayContinentBonuses = battleScreenInfo["Player" + plNum].continentBonus,
    displayVanguard = battleScreenInfo["Player" + plNum].vanguard,
    displayBonuses = battleScreenInfo["Player" + plNum].bonuses,
    displayPenalties = battleScreenInfo["Player" + plNum].penalties,
    displayHero = battleScreenInfo["Player" + plNum].hero,
    displayConspiracy = battleScreenInfo["Player" + plNum].conspiracy,
    displayDefensePlane = battleScreenInfo["Player" + plNum].defensePlane;



//create a div to hold plNum display
//add each piece of info if there is anything to display
//add a win button for each with a shared class and unique id



function displayBattleLocationInfo() {
    //set ground zero and display


}



console.log(displayName + " \nDeck: " + displayDeckName + " Color " + 
displayDeckColor + " \nLife " + displayLife + " Hand " + displayHand);

}






function openBattleScreen() {
    var numberOfPlayers = battleScreenInfo.playersInBattle.length;

    displayBattleLocationInfo()
    for (var i = 0; i < numberOfPlayers; i++) {
        var plNum = battleScreenInfo.playersInBattle[i];

        createBattleScreenInfo(plNum);
        loadBattleScreenDecks(plNum);
        displayBattlePlayerInfo(plNum);
    }
    addClass("battle-screen", "battle-screen-background-class");



    console.log(battleScreenInfo);

    console.log("Display winner buttons");

}




//Task Masters

function addClass(idToModify, classToAdd) {
    document.getElementById(idToModify).classList.add(classToAdd);
}

function removeClass(idToModify, classToRemove) {
    document.getElementById(idToModify).classList.remove(classToRemove);
}