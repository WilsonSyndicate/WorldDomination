
initialSetup();

buttonPlayerWin.addEventListener('click', function() {
    //get id of button that is clicked
    //button container that holds the buttons
});

idSetupCompleteButton.addEventListener('click', function() {
    setupComplete();
});

idPlayerCountUpdateButton.addEventListener('click', function() {
    updatePlayerCount();
});

idChangeNameButton.addEventListener('click', function() {
    updatePlayerName();
    resetSetupStatus();
});

idChangePlayerDropdown.addEventListener('change', function() {
    changeSetupPlayer();
    resetSetupStatus();
});

idChangeRedColor.addEventListener('change', function() {
    updateRedColor();
    resetSetupStatus();
});

idChangeGreenColor.addEventListener('change', function() {
    updateGreenColor();
    resetSetupStatus();
});

idChangeBlueColor.addEventListener('change', function() {
    updateBlueColor();
    resetSetupStatus();
});

optionUpdatePlayerCount.addEventListener('change', function() {
    resetUpdatePlayerCount()
});

optionSharedLibrary.addEventListener('change', function() {
    resetUpdatePlayerCount()
});

optionRandomMapSetup.addEventListener('change', function() {
    resetUpdatePlayerCount()
});
