
//Game Variables

var gameVars = {
    playerInfo: {},
    deckInfo: {},
    mapInfo: {
        countryList: [
            {country: 'Afghanistan', continent: 'Asia', color: 'G', borders: ['Ural', 'China','India','Middle East','Ukraine']},
            {country: 'Alaska', continent: 'North America', color: 'W', borders: ['Kamchatka', 'Northwest Territory','Alberta']},
            {country: 'Alberta', continent: 'North America', color: 'W', borders: ['Alaska', 'Northwest Territory','Ontario','Western USA']},
            {country: 'Argentina', continent: 'South America', color: 'S', borders: ['Brazil', 'Peru']},
            {country: 'Brazil', continent: 'South America', color: 'S', borders: ['Veneseulea', 'Argentina','Peru','North Africa']},
            {country: 'Central America', continent: 'North America', color: 'W', borders: ['Veneseulea', 'Eastern USA','Western USA']},
            {country: 'China', continent: 'Asia', color: 'G', borders: ['Mongolia', 'Siberia','Ural','Afghanistan','India','Siam']},
            {country: 'Congo', continent: 'Africa', color: 'B', borders: ['East Africa', 'South Africa','North Africa']},
            {country: 'East Africa', continent: 'Africa', color: 'B', borders: ['Egypt', 'North Africa','Congo','South Africa','Madagascar','Middle East']},
            {country: 'Eastern Australia', continent: 'Australia', color: 'R', borders: ['New Guinea', 'Western Australia']},
            {country: 'Eastern USA', continent: 'North America', color: 'W', borders: ['Quebec', 'Ontario','Western USA','Central America']},
            {country: 'Egypt', continent: 'Africa', color: 'B', borders: ['Middle East', 'Southern Europe','North Africa','East Africa']},
            {country: 'Great Britan', continent: 'Europe', color: 'U', borders: ['Iceland', 'Scandanavia','Northern Europe','Western Europe']},
            {country: 'Greenland', continent: 'North America', color: 'W', borders: ['Northwest Territory', 'Ontario','Quebec','Iceland']},
            {country: 'Iceland', continent: 'Europe', color: 'U', borders: ['Greenland', 'Scandanavia','Great Britan']},
            {country: 'India', continent: 'Asia', color: 'G', borders: ['Middle East', 'Afghanistan','China','Siam']},
            {country: 'Indonesia', continent: 'Australia', color: 'R', borders: ['Siam', 'New Guinea','Western Australia']},
            {country: 'Irkutsk', continent: 'Asia', color: 'G', borders: ['Yakutsk', 'Kamchatka','Mongolia','Siberia']},
            {country: 'Japan', continent: 'Asia', color: 'G', borders: ['Mongolia', 'Kamchatka']},
            {country: 'Kamchatka', continent: 'Asia', color: 'G', borders: ['Japan', 'Alaska','Mongolia','Irkutsk','Yakutsk']},
            {country: 'Madagascar', continent: 'Africa', color: 'B', borders: ['South Africa', 'East Africa']},
            {country: 'Middle East', continent: 'Asia', color: 'G', borders: ['East Africa', 'Egypt','Southern Europe','Ukraine','Afghanistan','India']},
            {country: 'Mongolia', continent: 'Asia', color: 'G', borders: ['Japan', 'Kamchatka','Irkutsk','Siberia','China']},
            {country: 'New Guinea', continent: 'Australia', color: 'R', borders: ['Indonesia', 'Eastern Australia','Western Australia']},
            {country: 'North Africa', continent: 'Africa', color: 'B', borders: ['Congo', 'Brazil','Western Europe','Southern Europe','Egypt','East Africa']},
            {country: 'Northern Europe', continent: 'Europe', color: 'U', borders: ['Great Britan', 'Scandanavia','Ukraine','Southern Europe','Western Europe']},
            {country: 'Northwest Territory', continent: 'North America', color: 'W', borders: ['Alaska', 'Alberta','Greenland','Ontario']},
            {country: 'Ontario', continent: 'North America', color: 'W', borders: ['Quebec', 'Eastern USA','Alberta','Western USA','Northwest Territory','Greenland']},
            {country: 'Peru', continent: 'South America', color: 'S', borders: ['Brazil', 'Argentina','Veneseulea']},
            {country: 'Quebec', continent: 'North America', color: 'W', borders: ['Eastern USA', 'Ontario','Greenland']},
            {country: 'Scandanavia', continent: 'Europe', color: 'U', borders: ['Iceland', 'Great Britan','Northern Europe','Ukraine']},
            {country: 'Siam', continent: 'Asia', color: 'G', borders: ['China', 'India','Indonesia']},
            {country: 'Siberia', continent: 'Asia', color: 'G', borders: ['China', 'Ural','Mongolia','Irkutsk','Yakutsk']},
            {country: 'South Africa', continent: 'Africa', color: 'B', borders: ['Congo', 'East Africa','Madagascar']},
            {country: 'Southern Europe', continent: 'Europe', color: 'U', borders: ['Western Europe', 'Northern Europe','Ukraine','Middle East','Egypt','North Africa']},
            {country: 'Ukraine', continent: 'Europe', color: 'U', borders: ['Scandanavia', 'Northern Europe','Southern Europe','Middle East','Afghanistan','Ural']},
            {country: 'Ural', continent: 'Asia', color: 'G', borders: ['Ukraine', 'Afghanistan','China','Siberia']},
            {country: 'Veneseulea', continent: 'South America', color: 'S', borders: ['Brazil', 'Peru','Central America']},
            {country: 'Western Australia', continent: 'Australia', color: 'R', borders: ['Eastern Australia', 'Indonesia','New Guinea']},
            {country: 'Western Europe', continent: 'Europe', color: 'U', borders: ['Great Britan', 'Northern Europe','North Africa','Southern Europe']},
            {country: 'Western USA', continent: 'North America', color: 'W', borders: ['Alberta', 'Ontario','Central America','Eastern USA']},
            {country: 'Yakutsk', continent: 'Asia', color: 'G', borders: ['Irkutsk', 'Kamchatka','Siberia']}
        ]
    },
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
        turnOrder: [],
        currentAttack: 1
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
