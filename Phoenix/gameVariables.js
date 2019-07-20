
//Game Variables

var gameVars = {
    playerInfo: {},
    deckInfo: {},
    mapInfo: {},
    battleScreenInfo: {
        groundZero: "",
        text: "",
        playersInBattleCount: [],
        battleDecks: [],
        battleWinners: []
    },
    gameLog: [],
    globalGameOptions: {
        totalPlayers: 2,
        sharedDeckPool: false,
        randomMapSetup: true
    },
    playerScreenOptions: {
        activeSetupPlayer: 1
    },
    gameStatus: {
        mode: "setup", //topOfTurn, Attack, onGoingAttack, mapSetupComplete
        focus: "setup", //map, battle, log
        turn: "initiation",
        nextTurn: "undecided",
        turnOrder: []
}};

//Admin Settings
const adminSettings = {
    lightTextSetting: 80,
    normalizeDeckList: true,
    supportBonus: {
        defendingLife: 3.2,
        defendingHand: 1.2,
        defendingPower: 0.3,
        defendingToughness: 0.4,
        attackingLife: 2.2,
        attackingHand: 0.9,
        attackingPower: 0.2,
        attackingToughness: 0.3
}};
