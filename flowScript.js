

function updateGameStatus() {
    switch (gameStatus) {
        case "new":
            gameStatus = "setup";
        break;

        case "setup":
                gameStatus = "initiative";
        break;

        case "setupConfirmed":
                gameStatus = "iniGame";
        break;

        default: console.log("Game Status Error");
    }
}

function displayDeckAuthor(p) {
    if (sharedDeckPool === true) {
        return " -" + playerInfo[p]["initiationDeck"][0]["deckAuthor"] + "'s version";
    }
    else {
        return "";
    }
}

function displayIniDeckName(p) {
    return playerInfo[p]["name"] + "'s " + playerInfo[p]["initiationDeck"][0]["deckName"] + 
        displayDeckAuthor(p);
}

function displayIniGame() {
    var element  = document.getElementById('display-ini-game');
    var fragment = document.createDocumentFragment();

    for (var i = 1; i <= playerCount; i++) {
        var node = document.createElement("Button");
        var textnode = document.createTextNode(displayIniDeckName(i - 1));
        
        node.appendChild(textnode);
        idDisplayAttackers.appendChild(node);
        node.className += "player-game-info";
        node.id += "player" + i + "Wins";
        fragment.appendChild(node);

        //create button for each deck to win
    };
    element.appendChild(fragment);

}

function setBattleScreen() {
    idBattleScreen.classList.remove("hide-screen");
    idEntireBackground.className += "battle-screen-background";
    switch (gameStatus) {
        case "iniGame":
            displayIniGame();
            console.log("display deck info");
        break;

        case "somethingelse":
        
                console.log("somethingelse");
        break;

        default:
            console.log("gameStatus Battlescreen Error");
    }
    document.body.style.backgroundColor = "black";
}