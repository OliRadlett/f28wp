const { Server } = require("ws");
const WebSocket = require("ws");
const readline = require("readline");


let enemies = [];

// VERY VERY basic - all of this will need redoing soon
// Also split this shit up into different classes etc.

// TODO move all this command crap into a different file

// Set up readline module to accept input from stdin
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let commands = [
    {command: "help", description: "Brings up this help menu"},
    {command: "exit", description: "Shuts down the server"},
    {command: "numclients", description: "Outputs the number of clients currently connected to the server"},
    {command: "restart", description: "Resets the clients set"}
];

function isCommand(command) {

    for (let i = 0; i < commands.length; i++) {

        if (command == commands[i].command) {

            return true;

        }

    }

    return false;

}

enemies.push(
    {
        // Idk if i like the length being calculated like this
        id: enemies.length - 1,
        type: "melee",
        x: 100,
        y: 100
    }
);

// Client tracking allows the server socket to create a set to keep track of all client connections
const ServerSocket = new WebSocket.Server({port: 8080, clientTracking: true});

ServerSocket.on("connection", ws => {

    ws.on("message", message => {

        // TODO send current clients to new client when they connect

        // All data is plain-text JSON so security is non-existant

        // This is shit cause we're only using this once so we don't need a functon
        if (isJson(message)) {

            message = JSON.parse(message);

        } else {

            // If the message isn't valid JSON for some weird reason then we exit out of the function to avoid a crash
            return;

        }

        switch (message.type) {

            case "clientConnected":
                console.log("Client connected with id " + message.id);
                ws.id = message.id;
                ws.position = {x: 0, y: 0};
                for (let client of ServerSocket.clients) {
                 
                    if (message.id != client.id) {

                        client.send(JSON.stringify({
                            type: "clientConnected",
                            id: message.id,
                            x: 0,
                            y: 0
                        }));

                    }

                }
                // Send all the clients to the newly connected client
                let currentClients = {
                    type: "synchroniseClients",
                    clients: [],
                };

                for (let client of ServerSocket.clients) {

                    if (message.id != client.id) {

                        currentClients.clients.push({
                            id: client.id,
                            x: client.position.x,
                            y: client.position.y
                        });

                    }

                }

                ws.send(JSON.stringify(currentClients));
                // Send over enemies array
                ws.send(JSON.stringify({
                    type: "syncEnemies",
                    enemies: enemies
                }));
                break;

            case "playerCoords":

                // For some reason the websocket stores clients in a Set rather than an array so we have to use weird for loop syntax
                for (let client of ServerSocket.clients) {

                    /* Client->Server rather than p2p
                    *  Each client sends their coordinates to the server
                    *  The server forwards the coordinates on to the rest of the clients
                    *  This is a very basic implementation and will need a lot of improving to avoid fuck tons of latency
                    */

                    if (client.id != message.id) {

                        client.send(JSON.stringify(message));

                    } else {
                    
                        // Update the position of the client stored on the server
                        client.position.x = message.x;
                        client.position.y = message.y;

                    }

                }
                break;

        }

    });

});

function sendAllClients(message) {

    for (let client of ServerSocket.clients) {

        client.send(JSON.stringify(message));

    }

}

// Only keep this as a function if we want to use it more than once
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Command line
rl.on("line", (line) => {

    if (!isCommand(line.split(" ")[0])) {

        console.log("Command not recognised");
        

    } else {
    
        switch (line.split(" ")[0]) {

            case "help":
                
                console.log("Available commands: ");

                for(let i = 0; i < commands.length; i++) {

                    console.log("* " + commands[i].command + " - " + commands[i].description);

                }

                break;

            case "exit":

                console.log("Shutting down server");
                process.exit(0);
                break;

            case "numclients":

                console.log("There are currently " + ServerSocket.clients.size + " clients connected to the server");
                break;

            case "restart":

                console.log("Restarting server");
                sendAllClients({
                    type: "restart"
                });
                ServerSocket.clients = new Set();
                break;

            default:

                console.log("Command not implemented yet");
                break;

        }

    }

});

console.log("Server starting on port 8080");
console.log("Type 'help' to see available commands");