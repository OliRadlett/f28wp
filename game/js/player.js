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

        this.y -= this.speed;
        this.element.style.top = this.y + "px";
    
    }
    
    down() {
    
        this.y += this.speed;
        this.element.style.top = this.y + "px";
    
    }
    
    left() {
    
        this.x -= this.speed;
        this.element.style.left = this.x + "px";
    
    }
    
    right() {
    
        this.x += this.speed;
        this.element.style.left = this.element.style.left = this.x + "px";
    
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