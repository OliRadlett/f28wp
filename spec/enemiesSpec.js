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

});