class Player {

    constructor(id) {

        this.x = 0;
        this.y = 0;
        this.speed = 10;
        this.id = id;
        // Create the player element here inside the player class
        this.element = document.getElementById("player");
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
    
    }
    
    right() {
    
        let dx = this.x + this.speed;

        if (dx < 10000) {

            this.x = dx;
            this.element.style.left = this.x + "px";

        }
    
    }
    
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

}