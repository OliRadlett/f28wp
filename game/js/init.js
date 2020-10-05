let UP = false;
let DOWN = false;
let LEFT = false;
let RIGHT = false;

let backgroundElement;
let playerElement;

window.onload = () => {

    loadFromDOM();
    loadAssets();
    setupObjects();
    setupControls();
    start();

};

function loadFromDOM() {

    backgroundElement = document.getElementById("background");
    playerElement = document.getElementById("player");
    
}

function loadAssets() {

    backgroundElement.style.backgroundImage = "url('res/test.png')";
    playerElement.style.backgroundImage = "url('res/player.png')";

}

function setupObjects() {

    // TODO make this lots better

    // Background
    backgroundElement.style.width = window.innerWidth + "px";
    backgroundElement.style.height = window.innerHeight + "px";
    // Player
    playerElement.style.top = ((window.innerHeight / 2) - 32) + "px";
    playerElement.style.left = ((window.innerWidth / 2) - 32) + "px";
    playerElement.style.width = 64 + "px";
    playerElement.style.height = 64 + "px";
    playerElement.style.backgroundRepeat = "no-repeat";
    // Change the default position
    backgroundElement.style.top = 0 + "px";
    backgroundElement.style.left = 0 + "px";
    backgroundElement.style.overflow = "hidden";
    backgroundElement.style.backgroundRepeat = "no-repeat";

}

function setupControls() {

    document.addEventListener("keydown", (event) => {

        switch(event.key) {

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

        switch(event.key) {

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