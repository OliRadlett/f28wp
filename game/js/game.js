let player;
let clients = [];
let map;
// Not a fan of this
let enemies = [];
let enemies_class = [];


let interval = 1; // We use 1ms for LAN but we need this to be higher when the server is on the internet or it'll just lag


// PUT ALL OF THIS IN A CLASS ITS MESSY AS SHITE

function start(playerID) {

    map = new Map();

    // Use parseMap as a promise to make sure the map is parsed before the player is created so we can use map data in the player constructor
    map.parseMap().then(() => {
        player = new Player(playerID);


        /*
        TEMP - this all needs moving to a seperate function which can be called inside this promise
        */

        window.requestAnimationFrame(update);

        // This shit has to be in a function or it gets executed before the websocket is ready
        // But this is a very lazy place to put it, I'll probably move it at some point

        setInterval(() => {

            webSocket.send(JSON.stringify({

                type: "playerCoords",
                id: player.getID,
                x: player.getX,
                y: player.getY

            }));

        }, interval);

        setInterval(() => {

            let p = {
                username: player.username,
                token: player.token,
                x: player.getX,
                y: player.getY
                // etc
            };

            callApi("POST", "http://localhost:8081/save", {
                player: p
            }, (result) => {

                if (result.error) {

                    // If there is an error saving alert the user
                    alert(result.error);

                }

            });

        }, 30000);

        webSocket.onmessage = (message) => {

            // TODO handle not JSON messages without crashing

            message = JSON.parse(message.data);

            switch (message.type) {

                // TODO handle clients disconnecting

                case "clientConnected":

                    createClient({
                        id: message.id,
                        x: message.x,
                        y: message.y
                    });
                    break;

                case "playerCoords":

                    for (let i = 0; i < clients.length; i++) {

                        if (message.id == clients[i].id) {

                            // TODO use setter functions
                            clients[i].x = message.x;
                            clients[i].y = message.y;

                        }

                    }

                    break;

                case "synchroniseClients":

                    for (let i = 0; i < message.clients.length; i++) {

                        let client = message.clients[i];

                        if (client.id != player.getID) {

                            createClient({
                                id: client.id,
                                x: client.x,
                                y: client.y
                            });

                        }

                    }

                    break;

                case "syncEnemies":
                    for (i = 0; i < message.enemies.length; i++) {

                        // console.log(message.enemies[i]);

                        if (enemies.find((e) => {
                                return e.id == message.enemies[i].id;
                            })) {

                            // TODO use setters
                            enemies[message.enemies[i].id].x = message.enemies[i].x;
                            enemies[message.enemies[i].id].y = message.enemies[i].y;
                            enemies_class[i].x = message.enemies[i].x;
                            enemies_class[i].y = message.enemies[i].y;

                        } else {

                            enemies.push(message.enemies[i]);
                            // TODO make this do different types of enemy
                            enemies_class.push(new Melee(message.enemies[i].x, message.enemies[i].y, message.enemies[i].id));

                        }

                    }
                    break;

                    // Used only for development
                case "restart":
                    location.reload();
                    break;

            }

        };

    });

}

function update(delta) {


    // Player movement code
    // This needs some work
    // Might want to be moved around a bit but it works for now

    if (UP) {

        player.up();

    }

    if (DOWN) {

        player.down();

    }

    if (LEFT) {

        player.left();

    }

    if (RIGHT) {

        player.right();

    }
    if (ATTACK) {
        player.attack();
    }

    // VERY TEMP
    if (!UP && !DOWN && !LEFT && !RIGHT && !ATTACK) {

        if (player.direction == player.directions.left) {
            //Old code
            player.element.style.backgroundImage = "url('res/classes/knight/player_still_left.png')";

            //Changes the sprite of the player depending on their class. Probably a better way of doing this
            // player.element.style.backgroundImage = "url('res/classes/" + player.playerClass + "/player_still_left.png')";

        }

        if (player.direction == player.directions.right) {

            //Old code
            player.element.style.backgroundImage = "url('res/classes/knight/player_still_right.png')";

            //Changes the sprite of the player depending on their class. Probably a better way of doing this
            // player.element.style.backgroundImage = "url('res/classes/" + player.playerClass + "/player_still_right.png')";

        }

    }

    // Update client positions
    for (i = 0; i < clients.length; i++) {

        clients[i].element.style.top = clients[i].getY + "px";
        clients[i].element.style.left = clients[i].getX + "px";

    }

    // Update AI behaviour
    for (i = 0; i < enemies_class.length; i++) {

        enemies_class[i].updatePos();
        enemies_class[i].update();

    }

    // Player "camera"
    window.scroll(player.getX - ((window.innerWidth / 2) - 32), player.getY - ((window.innerHeight / 2) - 32));

    window.requestAnimationFrame(update);

}

function getCoordinates(id) {

    let element = document.getElementById(id);
    let left = parseInt(element.style.left.replace("px", ""), 10);
    let top = parseInt(element.style.top.replace("px", ""), 10);

    return {
        left: left,
        top: top
    };

}

// Not really sure why this function exists
function createClient(client) {

    clients.push(new Client(client.id, client.x, client.y));

}

const callApi = async (method, url, body, callback) => {

    try {

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const responseData = await response.json();

        callback(responseData, response.status);

    } catch (e) {

        console.error(e);

    }

};