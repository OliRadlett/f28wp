class Projectile {

    constructor(x, y, mx, my, class_) {

        this.x = x;
        this.y = y;
        this.mx = mx;
        this.my = my;
        this.player_class = class_;
        this.angle = this.getAngle(this.x, this.y, this.mx, this.my);

        this.element = document.body.appendChild(this.createElement());

    }

    createElement() {

        let element = document.createElement("div");

        if (this.player_class == "wizard") {

            element.style.backgroundImage = "url('res/classes/wizard/fireball.png')";

        } else if (this.player_class == "archer") {

            element.style.backgroundImage = "url('res/classes/archer/arrow.png')";

        }

        element.className = "projectile";
        element.style.top = this.y + "px";
        element.style.left = this.x + "px";
        element.style.width = 32 + "px";
        element.style.height = 19 + "px";
        element.style.position = "absolute";
        element.style.zIndex = 10;
        element.style.backgroundRepeat = "no-repeat";
        element.style.transform = "rotate(" + this.angle * 180 / Math.PI + "deg)";

        return element;

    }



    update() {

        let left = parseInt(this.element.style.left.replace("px", ""), 10);
        let top = parseInt(this.element.style.top.replace("px", ""), 10);

        if (left != this.x) {

            this.element.style.left = this.x + "px";

        }

        if (top != this.y) {

            this.element.style.top = this.y + "px";

        }

        this.x = this.x + Math.cos(this.angle) * 10;
        this.y = this.y + Math.sin(this.angle) * 10;


    }

    getAngle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

}