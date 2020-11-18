class Player {

    constructor(id) {

        this.x = 0;
        this.y = 0;
        this.speed = 1;
        this.health = 100;
        this.id = id;
        this.directions = {
            left: 0,
            right: 1
        };
        this.direction = this.directions.right;
        // TODO Create the player element here inside the player class
        this.element = document.getElementById("player");
        this.collisionMask = document.body.appendChild(this.createCollisionMask());
        this.element.style.backgroundImage = "url('res/classes/knight/player_walk_right.gif')";
        document.getElementById("playerId").innerHTML = "Client id: " + id;

    }

    // All this shit is basically copied from game.js so it could do with a rewrite at some point to make it more efficient

    up() {

        let dy = this.y - this.speed;
        this.collisionMask.style.top = dy + "px";
        this.collisionMask.style.left = this.x + "px";
        let canMove = true;

        if (map.collidables[Math.round(this.x / 64)][Math.round(dy / 64)]) {

            canMove = false;

        }

        if (canMove) {

            this.y = dy;
            this.element.style.top = this.y + "px";

        }

    }

    down() {

        let dy = this.y + this.speed;
        this.collisionMask.style.top = dy + "px";
        this.collisionMask.style.left = this.x + "px";
        let canMove = true;

        if (map.collidables[Math.round(this.x / 64)][Math.round(dy / 64)]) {

            canMove = false;

        }

        if (canMove) {

            this.y = dy;
            this.element.style.top = this.y + "px";

        }

    }

    left() {

        let dx = this.x - this.speed;
        this.collisionMask.style.top = this.y + "px";
        this.collisionMask.style.left = dx + "px";
        let canMove = true;

        if (map.collidables[Math.round(dx / 64)][Math.round(this.y / 64)]) {

            canMove = false;

        }

        if (canMove) {

            this.x = dx;
            this.element.style.left = this.x + "px";

        }

        // Temp
        this.element.style.backgroundImage = "url('res/classes/knight/player_walk_left.gif')";
        this.direction = this.directions.left;

    }

    right() {

        let dx = this.x + this.speed;
        this.collisionMask.style.top = this.y + "px";
        this.collisionMask.style.left = dx + "px";
        let canMove = true;

        if (map.collidables[Math.round(dx / 64)][Math.round(this.y / 64)]) {

            canMove = false;

        }

        if (canMove) {

            this.x = dx;
            this.element.style.left = this.x + "px";

        }

        // Temp
        this.element.style.backgroundImage = "url('res/classes/knight/player_walk_right.gif')";
        this.direction = this.directions.right;


    }

    createCollisionMask() {

        let e = document.createElement("div");

        e.className = "playerCollisionMask";
        e.style.top = this.y + "px";
        e.style.left = this.x + "px";
        e.style.width = "64px";
        e.style.height = "64px";
        e.style.position = "absolute";
        e.style.zIndex = 11;


        // [DEBUG ONLY]
        e.style.backgroundColor = "blue";
        e.style.opacity = 0.3;

        return e;

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

if (typeof module == "undefined") {

    window.module = {};
    module.exports = () => {
        return true;
    };

}

module.exports = Player;