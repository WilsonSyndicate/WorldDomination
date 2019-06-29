
//Game Variables
var playerInfo = {},
deckInfo = {},
mapInfo = {},
battleScreenInfo = {},
gameLog = [],
globalGameOptions = {
    totalPlayers: 2,
    sharedDeckPool: false,
    randomMapSetup: true
},
playerScreenOptions = {
    activeSetupPlayer: 1
};

//Buttons
var buttonBeginPlayerSetup = document.getElementById("button-begin-player-setup");