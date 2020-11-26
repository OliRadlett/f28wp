class Client {

    // Needs some work but it's ok for now

    constructor(id, x, y, class_) {

        this.x = x;
        this.y = y;
        this.id = id;
        this.class_ = class_;
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

    get getClass() {

        return this.class_;

    }

    createElement() {

        let element = document.createElement("div");

        // alert(this.class_)

        // We'll want to preload the assets somehow instead of loading things every time a client connects

        switch (this.class_) {

            case "archer":
                this.element.style.backgroundImage = "url('res/classes/archer/player_still_right.png')";
                break;
            case "knight":
                this.element.style.backgroundImage = "url('res/classes/knight/player_still_right.png')";
                break;
            case "wizard":
                this.element.style.backgroundImage = "url('res/classes/wizard/player_still_right.png')";
                break;

        }

        element.className = "client";
        element.style.top = -this.y + "px";
        element.style.left = this.x + "px";
        element.style.width = 64 + "px";
        element.style.height = 64 + "px";
        element.style.position = "absolute";
        element.style.zIndex = 10;
        element.style.backgroundRepeat = "no-repeat";

        // The problem here is that we dont know the class of the client when its created
        // Im too tired to sort this now
        // element.style.backgroundColor = "red";

        return element;

    }

}