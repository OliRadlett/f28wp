class Player {

    constructor(id) {

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

        document.addEventListener("click", this.attack.bind(this), false);
        // document.addEventListener("mousemove", this.attack.bind(this), false);

        let params = this.parse(window.location.search);

        try {

            this.username = params[0][1];
            this.token = params[1][1];

        } catch (error) {

            window.location = "start_menu.html";

        }


        callApi("POST", "http://localhost:8081/verify", {
            username: this.username,
            token: this.token
        }, (result) => {

            if (result.verified) {

                document.getElementById("username").innerHTML = "Username: " + this.username;

                this.class = result.class;

                switch (result.class) {

                    case "archer":
                        this.element.style.backgroundImage = "url('res/classes/archer/player_walk_right.gif')";
                        break;
                    case "knight":
                        this.element.style.backgroundImage = "url('res/classes/knight/player_walk_right.gif')";
                        break;
                    case "wizard":
                        this.element.style.backgroundImage = "url('res/classes/wizard/player_walk_right.gif')";
                        break;

                }

                if (result.newPlayer === true) {

                    let startingCoordinates = this.generateStartingCoordinates();

                    this.x = startingCoordinates.x;
                    this.y = startingCoordinates.y;

                } else {

                    this.x = result.x;
                    this.y = result.y;

                }

                webSocket.send(JSON.stringify({
                    type: "setClass",
                    id: this.id,
                    class: this.class
                }));

            } else {

                window.location = "start_menu.html";

            }

        });

    }

    generateStartingCoordinates() {

        // NOTE - THIS IS ONLY FOR NEW PLAYERS, RETURNING PLAYERS WILL SPAWN IN THEIR LAST KNOWN POSITION

        // This method is not truely random because some of edges contain more than one boundary object (corners for example) but it works well enough :)

        let isValid = false;
        let x = null;
        let y = null;

        while (!isValid) {

            let dx = Math.floor(Math.random() * 15360);
            let dy = Math.floor(Math.random() * 15360);

            if (map.collidables[Math.floor(dx / 64)][Math.floor(dy / 64)]) {

                // Generate a new set of coordinates if we are on the edge of the map
                continue;

            }

            // https://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon/

            let count = 0;

            // Not this might have to change if we include shit like houses in this array
            // Could fix this by having map borders stored in a seprate array as well as in collidables
            // But this works as a proof of concept

            for (let row = Math.floor(dx / 64); row < map.collidables.length; row++) {

                if (map.collidables[row][Math.floor(dy / 64)]) {

                    count++;

                }

            }

            // If count is odd
            if (count % 2 != 0) {

                x = dx;
                y = dy;
                isValid = true;

            }

        }

        return {
            x: x,
            y: y
        };

    }

    // All this shit is basically copied from game.js so it could do with a rewrite at some point to make it more efficient

    up() {

        let dy = this.y - this.speed;
        this.collisionMask.style.top = dy + "px";
        this.collisionMask.style.left = this.x + "px";
        let canMove = true;

        // Could swap Math.round with Math.floor to improve collisions idk
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

        switch (this.class) {

            case "archer":
                this.element.style.backgroundImage = "url('res/classes/archer/player_walk_left.gif')";
                break;
            case "knight":
                this.element.style.backgroundImage = "url('res/classes/knight/player_walk_left.gif')";
                break;
            case "wizard":
                this.element.style.backgroundImage = "url('res/classes/wizard/player_walk_left.gif')";
                break;

        }
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

        switch (this.class) {

            case "archer":
                this.element.style.backgroundImage = "url('res/classes/archer/player_walk_right.gif')";
                break;
            case "knight":
                this.element.style.backgroundImage = "url('res/classes/knight/player_walk_right.gif')";
                break;
            case "wizard":
                this.element.style.backgroundImage = "url('res/classes/wizard/player_walk_right.gif')";
                break;

        }
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
        // e.style.opacity = 0.3;
        e.style.opacity = 0;

        return e;

    }

    attack(e) {

        projectiles.push(new Projectile(this.x, this.y, e.pageX, e.pageY, this.class));

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


    parse(qs) {
        return qs.
        replace(/^\?/, '').
        split('&').
        map(str => str.split('=').map(v => decodeURIComponent(v)));
    }

}

if (typeof module == "undefined") {

    window.module = {};
    module.exports = () => {
        return true;
    };

}

module.exports = Player;