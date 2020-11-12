class Player {

    constructor(id, playerClass) {

        this.x = 0;
        this.y = 0;
        this.speed = 1;
        this.health = 100
        this.id = id;
        this.directions = {
            left: 0,
            right: 1
        };
        this.direction = this.directions.right;

        this.playerClass = playerClass
        //playerClass is the way to choose what class the player is. Right now it needs to be changed in the code
        this.playerClass = "knight";
        //TODO make it so clicking on the character select will pick the right class

        //Makes the archer class speedy
        if (this.playerClass == "archer") {
            this.speed = 1.5;
        }
        // TODO Create the player element here inside the player class
        this.element = document.getElementById("player");

        this.element.style.backgroundImage = "url('res/classes/" + this.playerClass + "/player_still_right.png')";




        document.getElementById("playerId").innerHTML = "Client id: " + id;

        //character's health if they get hit, they will loose health, the id for this is in character_selection.html
        //not sure if this works
        

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
        if (!ATTACK) {
            this.element.style.backgroundImage = "url('res/classes/" + this.playerClass + "/player_walk_left.gif')";
        }
        this.direction = this.directions.left;

    }

    right() {

        let dx = this.x + this.speed;

        if (dx < 10000) {

            this.x = dx;
            this.element.style.left = this.x + "px";

        }

        // Temp
        if (!ATTACK) {

            this.element.style.backgroundImage = "url('res/classes/" + this.playerClass + "/player_walk_right.gif')";
        }
        this.direction = this.directions.right;


    }

    //Beginning of an attack, it stops player movement then plays the attack gif
    attack() {

        UP = false;
        DOWN = false;
        LEFT = false;
        RIGHT = false;
        if (this.direction == this.directions.right) {
            this.element.style.backgroundImage = "url('res/classes/" + this.playerClass + "/player_attack_right.gif')";
            //alert("Going right");
        }
        else if (this.direction == this.directions.left) {
            this.element.style.backgroundImage = "url('res/classes/" + this.playerClass + "/player_attack_left.gif')";
            //alert("Going left");
        }
        //alert("Attack");
        if (this.playerClass == "archer") {
            setTimeout(function () { ATTACK = false; }, 2428.57);

        }
        else if (this.playerClass == "knight") {
            setTimeout(function () { ATTACK = false; }, 1857.14);

        }
        else if (this.playerClass == "wizard") {
            setTimeout(function () { ATTACK = false; }, 2142.86);


        }
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