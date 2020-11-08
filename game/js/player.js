class Player {

    constructor(id) {

        this.x = 0;
        this.y = 0;
        this.speed = 1;
        this.id = id;
        this.directions = {
            left: 0,
            right: 1
        };
        this.direction = this.directions.right;
        // TODO Create the player element here inside the player class
        this.element = document.getElementById("player");
        this.element.style.backgroundImage = "url('res/classes/knight/player_walk_right.gif')";
        document.getElementById("playerId").innerHTML = "Client id: " + id;

    }

    // All this shit is basically copied from game.js so it could do with a rewrite at some point to make it more efficient

    up() {

        let dy = this.y - this.speed;

        // Fix the calculations to that > 0 instead of > -10 before handing in
        if (dy > -10) {

            this.y = dy;
            this.element.style.top = this.y + "px";

        }

    }

    down() {

        let dy = this.y + this.speed;

        if (dy < 10000) {

            this.y = dy;
            this.element.style.top = this.y + "px";

        }

    }

    left() {

        let dx = this.x - this.speed;

        // Fix the calculations to that > 0 instead of > -10 before handing in
        if (dx > -10) {

            this.x = dx;
            this.element.style.left = this.x + "px";

        }

        // Temp
        this.element.style.backgroundImage = "url('res/classes/knight/player_walk_left.gif')";
        this.direction = directions.left;

    }

    right() {

        let dx = this.x + this.speed;

        if (dx < 10000) {

            this.x = dx;
            this.element.style.left = this.x + "px";

        }

        // Temp
        this.element.style.backgroundImage = "url('res/classes/knight/player_walk_right.gif')";
        this.direction = directions.right;


    }

    // TODO Rename getters and setters in the form below
    /*
    get x();
    set x();
    */

    get getX() {

        return this.x;

    }

    get getY() {

        return this.y;

    }

    get getSpeed() {

        return this.speed;

    }

    get getID() {

        return this.id;

    }

    set setX(x) {

        this.x = x;

    }

    set setY(y) {

        this.y = y;

    }

    setCoords(coords) {

        this.x = coords.x;
        this.y = coords.y;

    }

    set setSpeed(speed) {

        this.speed = speed;

    }

}

module.exports = Player;