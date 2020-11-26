const Player = require("../game/js/player.js");
const Enemy = require("../game/js/enemies.js").Enemy;
const Ranged = require("../game/js/enemies.js").Ranged;
const Melee = require("../game/js/enemies.js").Melee;

describe("enemy suite", () => {

    beforeAll(() => {

        // Mock the game interval
        // Temp variable
        global.interval = 1;

    });

    beforeEach(() => {

        global.player = new Player(1);

    });

    it("distance from player negative coordinates", () => {

        global.enemy = new Enemy(0, 0, 0);

        player.setCoords({
            x: -100,
            y: -100
        });

        let distance = enemy.distanceFromPlayer;

        expect(distance).toBe(141);

    });

    it("distance from player positive coordinates", () => {

        let enemy = new Enemy(0, 0, 0);

        player.setCoords({
            x: 100,
            y: 100
        });

        let distance = enemy.distanceFromPlayer;

        expect(distance).toBe(141);

    });

    it("create element", () => {

        let enemy = new Enemy(0, 0, 0);

        // TODO in the future change this to compare to an element object instead of a string
        expect(enemy.element.outerHTML).toBe('<div class="enemy" style="background-image: url(' + "'" + 'res/classes/knight/player_walk_right.gif' + "'" + '); top: 0px; left: 0px; width: 64px; height: 64px; position: absolute; z-index: 10; background-repeat: no-repeat; "></div>');

    });

    it("moves towards player when in range", () => {

        let enemy = new Ranged(0, 0, 0);

        // Mock up a blank websocket to avoid errors
        global.webSocket = {};
        global.webSocket.send = () => {
            return true;
        };

        // Move the player within vision
        player.setCoords({
            x: 50,
            y: 50
        });

        // Spy on the function to check if it gets called
        spyOn(enemy, "moveTowardsPlayer");

        // Manually run the update function once to trigger moveTowardsPlayer()
        enemy.update();

        expect(enemy.moveTowardsPlayer).toHaveBeenCalled();

    });

    it("don't move towards player when not in range", () => {

        let enemy = new Ranged(0, 0, 0);

        // Mock up a blank websocket to avoid errors
        global.webSocket = {};
        global.webSocket.send = () => {
            return true;
        };

        // Move the player within vision
        player.setCoords({
            x: 500,
            y: 500
        });

        // Spy on the function to check if it gets called
        spyOn(enemy, "moveTowardsPlayer");

        // Manually run the update function once to trigger moveTowardsPlayer()
        enemy.update();

        expect(enemy.moveTowardsPlayer).not.toHaveBeenCalled();

    });

});