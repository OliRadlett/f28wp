class Map {

    constructor() {

        this.parseMap();

    }

    parseMap() {

        fetch("res/map.json").then(response => response.json()).then(data => {

            let width = data.width;
            let height = data.height;

            for (let layer in data.layers) {

                // Skip layer 0 (image layer)
                if (layer != 0) {

                    let y = 1;
                    let x = 0;

                    for (let i in data.layers[layer].data) {

                        x++;

                        if (data.layers[layer].data[i] == 5) {

                            document.body.appendChild(this.drawDebugWall(x * 64, y * 64));

                        }

                        if (x == width) {

                            x = 0;
                            y++;

                        }

                    }

                }

            }

        });

    }

    drawDebugWall(x, y) {

        let element = document.createElement("div");

        element.style.backgroundColor = "purple";
        element.className = "wall";
        element.style.top = y + "px";
        element.style.left = x + "px";
        element.style.width = 64 + "px";
        element.style.height = 64 + "px";
        element.style.position = "absolute";
        element.style.zIndex = 10;

        return element;

    }

    get width() {

        return this.width;

    }

    get height() {

        return this.height;

    }

}