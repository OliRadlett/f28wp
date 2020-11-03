class Client {

    // Needs some work but it's ok for now

    constructor(id, x, y) {

        this.x = x;
        this.y = y;
        this.id = id;
        this.element = document.getElementById("body").appendChild(this.createElement());

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

    get getElement() {

        return this.element;

    }

    createElement() {

        let element = document.createElement("div");

        // We'll want to preload the assets somehow instead of loading things every time a client connects
        
        // element.style.backgroundImage = "url('res/player.png')";
        element.className = "client";
        element.style.top = -this.y + "px";
        element.style.left = this.x + "px";
        element.style.width = 64 + "px";
        element.style.height = 64 + "px";
        element.style.position = "absolute";
        element.style.zIndex = 10;
        element.style.backgroundRepeat = "no-repeat";

        return element;

    }

}