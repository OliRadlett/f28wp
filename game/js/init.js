// TODO Make a game class and add getters to remove all these crap globals

let UP = false;
let DOWN = false;
let LEFT = false;
let RIGHT = false;
let ATTACK = false;

// TEMP!!!
// Normally we'd use the map size but the map isn't finished yet
let GAMEWIDTH = 15360;
let GAMEHEIGHT = 15360;

let backgroundElement;
let playerElement;

// This isn't really the right place for these constants - should probably move them to game.js
let centreY = ((window.innerHeight / 2) - 32);
let centreX = ((window.innerWidth / 2) - 32);

let webSocket;
// All these globals make me feel ill
// I'm so sorry about how bad this is I promise I'll make this better before I hand it in

window.onload = () => {

    loadFromDOM();
    loadAssets();
    setupObjects();
    setupControls();
    initMultiplayer();

};

function loadFromDOM() {

    backgroundElement = document.getElementById("background");
    playerElement = document.getElementById("player");

}

function loadAssets() {

    backgroundElement.style.backgroundImage = "url('res/map/map.png')";
    // playerElement.style.backgroundImage = "url('res/player.png')";

}

function setupObjects() {

    // TODO make this lots better
    // idk why this isnt in the respective classes but it really needs to be

    // Background
    // backgroundElement.style.width = window.innerWidth + "px";
    // backgroundElement.style.height = window.innerHeight + "px";
    backgroundElement.style.width = GAMEWIDTH + "px";
    backgroundElement.style.height = GAMEHEIGHT + "px";
    // Player
    // THIS REALLY NEEDS TO BE IN THE PLAYER CLASS THIS IS PRETTY BAD

    // Also these positions should be set by the server not hard coded
    playerElement.style.top = "0px";
    playerElement.style.left = "0px";

    playerElement.style.width = 64 + "px";
    playerElement.style.height = 64 + "px";
    playerElement.style.backgroundRepeat = "no-repeat";
    // Change the default position
    backgroundElement.style.top = 0 + "px";
    backgroundElement.style.left = 0 + "px";
    backgroundElement.style.overflow = "hidden";
    backgroundElement.style.backgroundRepeat = "no-repeat";
    backgroundElement.style.backgroundSize = "cover";

}

function setupControls() {

    document.addEventListener("keydown", (event) => {

        switch (event.key) {
            case "k":
                ATTACK = true;
                break;
            case "w":
                UP = true;
                break;

            case "s":
                DOWN = true;
                break;

            case "a":
                LEFT = true;
                break;

            case "d":
                RIGHT = true;
                break;

            default:
                break;

        }

    });

    document.addEventListener("keyup", (event) => {

        switch (event.key) {

            case "w":
                UP = false;
                break;

            case "s":
                DOWN = false;
                break;

            case "a":
                LEFT = false;
                break;

            case "d":
                RIGHT = false;
                break;

            default:
                break;

        }

    });

}

function initMultiplayer() {

    let playerID = Date.now();

    start(playerID);

}