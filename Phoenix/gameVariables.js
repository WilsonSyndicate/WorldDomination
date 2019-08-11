
//Game Variables

var gameVars = {
    playerInfo: {},
    battleScreenInfo: {
        groundZero: "",
        text: "",
        playersInBattleCount: [],
        battleDecks: [],
        battleWinners: [],
        possibleAttacks: [],
        currentPlayerCountries: [],
        possibleJoinAttack: [],
        confirmedJoiner: []
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
    },
    mapInfo: {
        mapSelect1: "",
        mapSelect2: "",
        countryList: [
            {countryName: 'Afghanistan', country: 'afghanistan', continent: 'Asia', color: 'G', borders: ['ural', 'china','india','middle-east','ukraine']},
            {countryName: 'Alaska', country: 'alaska', continent: 'North America', color: 'W', borders: ['kamchatka', 'northwest-territory','alberta']},
            {countryName: 'Alberta', country: 'alberta', continent: 'North America', color: 'W', borders: ['alaska', 'northwest-territory','ontario','western-usa']},
            {countryName: 'Argentina', country: 'argentina', continent: 'South America', color: 'S', borders: ['brazil', 'peru']},
            {countryName: 'Brazil', country: 'brazil', continent: 'South America', color: 'S', borders: ['veneseulea', 'argentina','peru','north-africa']},
            {countryName: 'Central America', country: 'central-america', continent: 'North America', color: 'W', borders: ['veneseulea', 'eastern-usa','western-usa']},
            {countryName: 'China', country: 'china', continent: 'Asia', color: 'G', borders: ['mongolia', 'siberia','ural','afghanistan','india','siam']},
            {countryName: 'Congo', country: 'congo', continent: 'Africa', color: 'B', borders: ['east-africa', 'south-africa','north-africa']},
            {countryName: 'East Africa', country: 'east-africa', continent: 'Africa', color: 'B', borders: ['egypt', 'north-africa','congo','south-africa','madagascar','middle-east']},
            {countryName: 'Eastern Australia', country: 'eastern-australia', continent: 'Australia', color: 'R', borders: ['new-guinea', 'western-australia']},
            {countryName: 'Eastern USA', country: 'eastern-usa', continent: 'North America', color: 'W', borders: ['quebec', 'ontario','western-usa','central-america']},
            {countryName: 'Egypt', country: 'egypt', continent: 'Africa', color: 'B', borders: ['middle-east', 'southern-europe','north-africa','east-africa']},
            {countryName: 'Great Britan', country: 'great-britan', continent: 'Europe', color: 'U', borders: ['iceland', 'scandanavia','northern-europe','western-europe']},
            {countryName: 'Greenland', country: 'greenland', continent: 'North America', color: 'W', borders: ['northwest-territory', 'ontario','quebec','iceland']},
            {countryName: 'Iceland', country: 'iceland', continent: 'Europe', color: 'U', borders: ['greenland', 'scandanavia','great-britan']},
            {countryName: 'India', country: 'india', continent: 'Asia', color: 'G', borders: ['middle-east', 'afghanistan','china','siam']},
            {countryName: 'Indonesia', country: 'indonesia', continent: 'Australia', color: 'R', borders: ['siam', 'new-guinea','western-australia']},
            {countryName: 'Irkutsk', country: 'irkutsk', continent: 'Asia', color: 'G', borders: ['yakutsk', 'kamchatka','mongolia','siberia']},
            {countryName: 'Japan', country: 'japan', continent: 'Asia', color: 'G', borders: ['mongolia', 'kamchatka']},
            {countryName: 'Kamchatka', country: 'kamchatka', continent: 'Asia', color: 'G', borders: ['japan', 'alaska','mongolia','irkutsk','yakutsk']},
            {countryName: 'Madagascar', country: 'madagascar', continent: 'Africa', color: 'B', borders: ['south-africa', 'east-africa']},
            {countryName: 'Middle East', country: 'middle-east', continent: 'Asia', color: 'G', borders: ['east-africa', 'egypt','southern-europe','ukraine','afghanistan','india']},
            {countryName: 'Mongolia', country: 'mongolia', continent: 'Asia', color: 'G', borders: ['japan', 'kamchatka','irkutsk','siberia','china']},
            {countryName: 'New Guinea', country: 'new-guinea', continent: 'Australia', color: 'R', borders: ['indonesia', 'eastern-australia','western-australia']},
            {countryName: 'North Africa', country: 'north-africa', continent: 'Africa', color: 'B', borders: ['congo', 'brazil','western-europe','southern-europe','egypt','east-africa']},
            {countryName: 'Northern Europe', country: 'northern-europe', continent: 'Europe', color: 'U', borders: ['great-britan', 'scandanavia','ukraine','southern-europe','western-europe']},
            {countryName: 'Northwest Territory', country: 'northwest-territory', continent: 'North America', color: 'W', borders: ['alaska', 'alberta','greenland','ontario']},
            {countryName: 'Ontario', country: 'ontario', continent: 'North America', color: 'W', borders: ['quebec', 'eastern-usa','alberta','western-usa','northwest-territory','greenland']},
            {countryName: 'Peru', country: 'peru', continent: 'South America', color: 'S', borders: ['brazil', 'argentina','veneseulea']},
            {countryName: 'Quebec', country: 'quebec', continent: 'North America', color: 'W', borders: ['eastern-usa', 'ontario','greenland']},
            {countryName: 'Scandanavia', country: 'scandanavia', continent: 'Europe', color: 'U', borders: ['iceland', 'great-britan','northern-europe','ukraine']},
            {countryName: 'Siam', country: 'siam', continent: 'Asia', color: 'G', borders: ['china', 'india','indonesia']},
            {countryName: 'Siberia', country: 'siberia', continent: 'Asia', color: 'G', borders: ['china', 'ural','mongolia','irkutsk','yakutsk']},
            {countryName: 'South Africa', country: 'south-africa', continent: 'Africa', color: 'B', borders: ['congo', 'east-africa','madagascar']},
            {countryName: 'Southern Europe', country: 'southern-europe', continent: 'Europe', color: 'U', borders: ['western-europe', 'northern-europe','ukraine','middle-east','egypt','north-africa']},
            {countryName: 'Ukraine', country: 'ukraine', continent: 'Europe', color: 'U', borders: ['scandanavia', 'northern-europe','southern-europe','middle-east','afghanistan','ural']},
            {countryName: 'Ural', country: 'ural', continent: 'Asia', color: 'G', borders: ['ukraine', 'afghanistan','china','siberia']},
            {countryName: 'Veneseulea', country: 'veneseulea', continent: 'South America', color: 'S', borders: ['brazil', 'peru','central-america']},
            {countryName: 'Western Australia', country: 'western-australia', continent: 'Australia', color: 'R', borders: ['eastern-australia', 'indonesia','new-guinea']},
            {countryName: 'Western Europe', country: 'western-europe', continent: 'Europe', color: 'U', borders: ['great-britan', 'northern-europe','north-africa','southern-europe']},
            {countryName: 'Western USA', country: 'western-usa', continent: 'North America', color: 'W', borders: ['alberta', 'ontario','central-america','eastern-usa']},
            {countryName: 'Yakutsk', country: 'yakutsk', continent: 'Asia', color: 'G', borders: ['irkutsk', 'kamchatka','siberia']}
        ]
    }
};

//Admin Settings
const adminSettings = {
    lightTextSetting: 80,
    normalizeDeckList: true,
    buttonText: {
        confirmAttack: "Confirm Attack"
    },
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
