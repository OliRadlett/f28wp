let player;
let clients = [];
let enemies = [];

// PUT ALL OF THIS IN A CLASS ITS MESSY AS SHITE

function start(playerID) {

    player = new Player(playerID);
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

        // We use 1ms for LAN but we need this to be higher when the server is on the internet or it'll just lag
    }, 1);

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
                enemies = message.enemies;
                // TODO instantiate enemies classes based on the contents of enemies array
                break;

            // Used only for development
            case "restart":
                location.reload();
                break;

        }

    };

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

    // VERY TEMP
    if (!UP && !DOWN && !LEFT && !RIGHT) {

        if (player.direction == directions.left) {

            player.element.style.backgroundImage = "url('res/classes/knight/player_still_left.png')";


        }
        
        if (player.direction == directions.right) {

            player.element.style.backgroundImage = "url('res/classes/knight/player_still_right.png')";

        }

    }

    // Update client positions
    for (i = 0; i < clients.length; i++) {

        clients[i].element.style.top = clients[i].getY + "px";
        clients[i].element.style.left = clients[i].getX + "px";

    }

    // Update AI behaviour
    for (i = 0; i < enemies.length; i++) {

        enemies[i].updatePos();
        enemies[i].update();

    }

    // Player "camera"
    // Need to make it so that the player is in the centre of the screen
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

let directions = {

    left: 0,
    right: 1
        
};