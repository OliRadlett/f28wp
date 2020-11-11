class Map {

    constructor() {

        this.parseMap();

    }

    parseMap() {

        this.objects = {

            smallobjects: {

                cactus: 1,
                foresttree: 2,
                savannahtree: 3,
                tundratree: 4,
                boundary: 5

            },
            mediumobjects: {

            },
            largeobjects: {

            }

        };

        fetch("res/map.json").then(response => response.json()).then(data => {

            let width = data.width;
            let height = data.height;

            for (let layer in data.layers) {

                // Skip layer 0 (image layer)
                if (layer != 0) {

                    let y = 0;
                    let x = -1;

                    for (let i in data.layers[layer].data) {

                        x++;

                        switch (data.layers[layer].data[i]) {

                            case this.objects.smallobjects.cactus:
                                document.body.appendChild(this.drawTree(x * 64, y * 64, "cactus"));
                                break;

                            case this.objects.smallobjects.foresttree:
                                document.body.appendChild(this.drawTree(x * 64, y * 64, "forresttree"));
                                break;

                            case this.objects.smallobjects.savannahtree:
                                document.body.appendChild(this.drawTree(x * 64, y * 64, "savannahtree"));
                                break;

                            case this.objects.smallobjects.tundratree:
                                document.body.appendChild(this.drawTree(x * 64, y * 64, "tundratree"));
                                break;

                            case this.objects.smallobjects.boundary:

                                document.body.appendChild(this.drawDebugWall(x * 64, y * 64));
                                break;

                            default:
                                break;

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

    drawTree(x, y, tree) {

        let element = document.createElement("div");

        element.className = "tree";
        element.style.top = y + "px";
        element.style.left = x + "px";
        element.style.width = 64 + "px";
        element.style.height = 64 + "px";
        element.style.position = "absolute";
        element.style.zIndex = 10;

        switch (tree) {

            case "cactus":
                element.classList += " cactus";
                element.style.backgroundImage = "url('res/map/trees/cactus.png')";
                break;

            case "forresttree":
                element.classList += " forresttree";
                element.style.backgroundImage = "url('res/map/trees/forrest.png')";
                break;

            case "savannahtree":
                element.classList += " savannahtree";
                element.style.backgroundImage = "url('res/map/trees/savannah.png')";
                break;

            case "tundratree":
                element.classList += " tundratree";
                element.style.backgroundImage = "url('res/map/trees/tundra.png')";
                break;

        }

        return element;

    }

    get width() {

        return this.width;

    }

    get height() {

        return this.height;

    }

}