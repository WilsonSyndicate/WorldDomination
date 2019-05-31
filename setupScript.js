

function setInitiationDeck(currPl) {
    var tmpRef = Math.trunc(Math.random() * currPl["gameDeckLibrary"].length);

    currPl["initiationDeck"] = currPl["gameDeckLibrary"].slice(tmpRef, tmpRef + 1);
    currPl["gameDeckLibrary"].splice(tmpRef, 1);
}

function shufflePlayerDecks() {
    if (sharedDeckPool === true) { 
        var numberOfDecks = Math.trunc(masterDeckList["deckListPlayer1"].length / playerCount),
        tempDeckList = masterDeckList["deckListPlayer1"];

        for (var d = 0; d < tempDeckList.length; d++) {
            var swapIdx = Math.trunc(Math.random() * tempDeckList.length),
            tmp = tempDeckList[swapIdx];

            tempDeckList[swapIdx] = tempDeckList[d];
            tempDeckList[d] = tmp; 
        }

        for (var i = 1; i <= playerCount; i++) {
            var tempPlayerLibrary = [];

            for (var d = 0; d < numberOfDecks; d++) {
                var deckToMove = tempDeckList.shift();

                tempPlayerLibrary.push(deckToMove);
            }
            masterDeckList["deckListPlayer" + i] = tempPlayerLibrary;
        }
        sortLibraryList()
    }

    for (var i = 1; i <= playerCount; i++) {
        var tmpDeckList = eval(masterDeckList["deckListPlayer" + i]).concat();

        for (var d = 0; d < tmpDeckList.length; d++) {
            var swapIdx = Math.trunc(Math.random() * tmpDeckList.length),
            tmp = tmpDeckList[swapIdx];

            tmpDeckList[swapIdx] = tmpDeckList[i];
            tmpDeckList[i] = tmp;
            playerInfo[i - 1]["gameDeckLibrary"] = tmpDeckList;
        }
        setInitiationDeck(playerInfo[i - 1]);
    }
}

function beginGame () {
    shufflePlayerDecks();
    idGameHeader.innerHTML = "World Domination Initiative Game";
    idSetupInfo.className += "hide-screen";
    updateGameStatus();
    setBattleScreen();
}

function resetSetupStatus() {
    idSetupCompleteButton.classList.remove("button-confirm");
    gameStatus = "setup";
}

function changeSetupPlayer() {
    activeSetupPlayer = idPlayerDropDownOption.value;
    playerRef = activeSetupPlayer - 1;
    displayPlayerInfo();
}

function setupComplete() {
    switch (gameStatus) {
        case "setupConfirmed":
            beginGame();
        break;

        case "setup":
            idSetupCompleteButton.className += "button-confirm";
            gameStatus = "setupConfirmed";
        break;

        default :  
            console.log("Setup Button Error");
    }
}

function updatePlayerName() {
    var n = prompt("Choose Name",playerInfo[playerRef].name);

    if (n !== null || n !== "") {
        playerInfo[playerRef].name = n;
        displayPlayerInfo();
    }
}

function rgb(r,g,b) {
    return 'rgb(' + [(r||0),(g||0),(b||0)].join(',') + ')';
}

function showColor() {
    document.body.style.backgroundColor = rgb(redValue,greenValue,blueValue);
}

function updatePlayerColor() {
    playerInfo[playerRef].color = [redValue,greenValue,blueValue];
    showColor();
}

function updateRedColor() {
    redValue = idChangeRedColor.value;
    updatePlayerColor();
}

function updateGreenColor() {
    greenValue = idChangeGreenColor.value;
    updatePlayerColor();
}

function updateBlueColor() {
    blueValue = idChangeBlueColor.value;
    updatePlayerColor();
}

function loadColor() {
    redValue = playerInfo[playerRef].color[0];
    greenValue = playerInfo[playerRef].color[1];
    blueValue = playerInfo[playerRef].color[2];
    idChangeRedColor.value = redValue;
    idChangeGreenColor.value = greenValue;
    idChangeBlueColor.value = blueValue;
}

function sortLibraryList() {
    for (var l = 1; l <= playerCount; l++) {
        var libToUpdate = eval("masterDeckList['" + `deckListPlayer${l}` +"']");

        libToUpdate.sort(function(a, b) {
            var nameA = a.deckName.toUpperCase(),
            nameB = b.deckName.toUpperCase();

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
    }
}

function sharedLibraryList() {
    var listOfPlayers = [],
    sharedDeckList = [];

    for (var p = 1; p <= playerCount; p++) {
        const playerName = eval("masterDeckList['" + `deckListPlayer${p}` +"']");

        listOfPlayers.push(playerName);
    }

    for (var i = 0; i < listOfPlayers.length; i++) { 
        for (var k = 0; k < listOfPlayers[i].length; k++) {
            sharedDeckList.push(listOfPlayers[i][k]);
        }
    }

    sharedDeckList.sort(function (a, b) {
        var nameA = a.deckName.toUpperCase(),
        nameB = b.deckName.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    for (var n = 1; n <= listOfPlayers.length; n++) {
        masterDeckList["deckListPlayer" + n] = sharedDeckList;
    }
}

function displayPlayerInfo() {
    var nameToShow = playerInfo[playerRef].name,
    deckListToShow = masterDeckList["deckListPlayer" + activeSetupPlayer],
    k = '';

    loadColor();
    showColor();

    idNameToShow.innerHTML = nameToShow;

    idPlayerDeckCount.innerHTML = "Deck List Count: " + deckListToShow.length;

    for (var i = 0; i < deckListToShow.length; i++) {
        k+= '<tr class="player-deck-row">';
        k+= '<td>' + deckListToShow[i].deckName + '</td>';
        k+= '<td>' + deckListToShow[i].deckColor + '</td>';
        k+= '<td>' + deckListToShow[i].deckFormat + '</td>';
        k+= '<td>' + deckListToShow[i].deckCards + '</td>';
        k+= '<td>' + deckListToShow[i].deckRank + '</td>';
        k+= '<td>' + deckListToShow[i].deckNotes + '</td>';
        k+= '</tr>';
    }
    idPlayerDeckListLibrary.innerHTML = k;
}

function createPlayerVars () {
    for (var i = 1; i <= playerCount; i++) {
        playerInfo.push ( {
            player: i,
            name: "Player " + i,
            color: [255,255,255],
            initiationDeck: [],
            gameDeckLibrary: [],
            deckList: "deckListPlayer" + i
        });
    }
    updateGameStatus();
}

function updatePlayerChoice() {
    for (var i = 1; i <= playerCount; i++) {
        var x = document.getElementById("player-dropdown-option");
        var option = document.createElement("option");
        option.text = i;
        x.add(option);
    };
}

function resetUpdatePlayerCount() {
    playerCountConfirm = false;
    idPlayerCountUpdateButton.classList.remove("button-confirm");
}

function updatePlayerCount() {
    switch (playerCountConfirm) {
        case true:
            playerCount = parseFloat(optionUpdatePlayerCount.value);
            sharedDeckPool = optionSharedLibrary.checked;
            randomMapSetup = optionRandomMapSetup.checked;

            if (sharedDeckPool === true) {
                sharedLibraryList();
            } 
            else {
                sortLibraryList();
            }
            updatePlayerChoice();
            createPlayerVars();
            displayPlayerInfo();
            idSetupInfo.classList.remove("hide-screen");
            idGameOptions.className += "hide-screen";
            idGameInfo.className += "hide-screen";
            idBattleScreen.className += "hide-screen";
        break;

        case false:
            playerCountConfirm = true;
            idPlayerCountUpdateButton.className += "button-confirm";
        break;

        default:
            console.log("Player Confirm Button Error");
    }
}

function initialSetup() {
    idSetupInfo.className += "hide-screen";
    idBattleScreen.className += "hide-screen";
    optionUpdatePlayerCount.max = maxPlayerCount;
}

