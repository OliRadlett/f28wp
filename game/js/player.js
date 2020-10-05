class Player {

    constructor() {

        this.x = 0;
        this.y = 0;
        this.speed = 10;
        this.element = document.getElementById("player");

    }

    up() {

        this.y += this.speed;
    
    }
    
    down() {
    
        this.y -= this.speed;
    
    }
    
    left() {
    
        this.x -= this.speed;
    
    }
    
    right() {
    
        this.x += this.speed;
    
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

}