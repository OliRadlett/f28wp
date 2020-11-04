class Enemy {

    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.element = document.getElementById("body").appendChild(this.createElement());
        // Temp
        this.id = null;
        this.direction = null;

    }

    get getX() {
    
        return this.x;
    
    }
    
    get getY() {
    
        return this.y;
    
    }

    get distanceFromPlayer() {
        
        // Use Pythagoras to calculate the distance from the player to the enemy
        let a = this.x - player.getX;
        let b = this.y - player.getY;
        let c = Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));

        return c;

    }

    createElement() {

        let element = document.createElement("div");

        // We'll want to preload the assets somehow instead of loading things every we spawn an enemy
        
        element.style.backgroundImage = "url('res/classes/knight/player_walk_right.gif')";
        element.className = "enemy";
        element.style.top = this.y + "px";
        element.style.left = this.x + "px";
        element.style.width = 64 + "px";
        element.style.height = 64 + "px";
        element.style.position = "absolute";
        element.style.zIndex = 10;
        element.style.backgroundRepeat = "no-repeat";

        return element;

    }

    moveTowardsPlayer() {

        if (Math.floor(this.x) > player.x) {

            this.x = this.x - this.speed;

        } else if (Math.floor(this.x) < player.x) {

            this.x = this.x + this.speed;

        }

        if (Math.floor(this.y) > player.y) {

            this.y = this.y - this.speed;

        } else if (Math.floor(this.y) < player.y) {

            this.y = this.y + this.speed;

        }
        

    }

    updatePos() {

        let left = parseInt(this.element.style.left.replace("px", ""), 10);
        let top = parseInt(this.element.style.top.replace("px", ""), 10);

        if (left != this.x) {

            this.element.style.left = this.x + "px";

        }

        if (top != this.y) {

            this.element.style.top = this.y + "px";

        }

    }

}

class Ranged extends Enemy {

    constructor(x, y) {

        super(x, y);

        // idk this is just a test
        this.vision = 500;
        this.range = 300;
        this.speed = 1.5;

        this.element.classList.add("ranged");

    }

    update() {

        if (this.distanceFromPlayer < this.vision) {

            this.moveTowardsPlayer();

        }

    }

}

class Melee extends Enemy {

    constructor(x, y) {

        super(x, y);

        // idk this is just a test
        this.vision = 400;
        this.speed = 0.7;

        this.element.classList.add("melee");

    }

    update() {
        
        if (this.distanceFromPlayer < this.vision) {

            this.moveTowardsPlayer();

        }

    }

}