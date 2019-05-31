//DOM Variables
var idPlayerCountUpdateButton = document.getElementById("button-player-count"),
setupCompleteButton = document.getElementById("button-setup-complete"),
idBattleScreen = document.getElementById("battle-screen"),
idGameHeader = document.getElementById("game-header"),
idSetupInfo = document.getElementById("setup-info"),
buttonPlayerWin = document.getElementsByClassName("player-game-info");

//Battle Screen DOM Variables
var idDisplayDefender = document.getElementById("display-defender"),
idDisplayAttackers = document.getElementById("display-attackers");

//Setup Variables
var idChangeNameButton = document.getElementById("button-change-name"),
idChangePlayerDropdown = document.getElementById("dropdown-player-select"),
idChangeRedColor = document.getElementById("red-value"),
idChangeGreenColor = document.getElementById("green-value"),
idChangeBlueColor = document.getElementById("blue-value"),
idPlayerDeckListLibrary = document.getElementById("player-decklist-library"),
idPlayerDeckCount = document.getElementById("player-decklist-count"),
idGameInfo = document.getElementById("game-info"),
idGameOptions = document.getElementById("game-options"),
idPlayerDropDownOption = document.getElementById("player-dropdown-option"),
idNameToShow = document.getElementById("name-to-show"),
idSetupCompleteButton = document.getElementById("button-setup-complete"),
idEntireBackground = document.getElementById("entire-background"),
redValue = idChangeRedColor.value,
greenValue = idChangeGreenColor.value,
blueValue = idChangeGreenColor.value;

//Option Variables
var optionUpdatePlayerCount = document.getElementById("update-player-count"),
optionSharedLibrary = document.getElementById("shared-library"),
optionRandomMapSetup = document.getElementById("random-map-setup");

//Global Variables
var mapSetup = false,
gameStatus = "new",
playerCountConfirm = false,
playerCount = 0,
maxPlayerCount = Object.keys(masterDeckList).length,
sharedDeckPool = false,
randomMapSetup = true,
sharedLibraryPool =[],
playerInfo = [],
activeSetupPlayer = 1,
playerRef = 0;


