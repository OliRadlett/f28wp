const {
    Server
} = require("ws");
const WebSocket = require("ws");
const express = require("express");
const MongoClient = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const readline = require("readline");


// Game server

let enemies = [];

// VERY VERY basic - all of this will need redoing soon
// Also split this shit up into different classes etc.

// TODO move all this command crap into a different file

// Set up readline module to accept input from stdin
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let commands = [{
        command: "help",
        description: "Brings up this help menu"
    },
    {
        command: "exit",
        description: "Shuts down the server"
    },
    {
        command: "numclients",
        description: "Outputs the number of clients currently connected to the server"
    },
    {
        command: "restart",
        description: "Resets the clients set"
    }
];

function isCommand(command) {

    for (let i = 0; i < commands.length; i++) {

        if (command == commands[i].command) {

            return true;

        }

    }

    return false;

}


// Temp just to spawn in some enemies
enemies.push({
    // Idk if i like the length being calculated like this
    id: enemies.length,
    type: "melee",
    x: 400,
    y: 400
});

enemies.push({
    // Idk if i like the length being calculated like this
    id: enemies.length,
    type: "melee",
    x: 600,
    y: 700
});

// Client tracking allows the server socket to create a set to keep track of all client connections
const ServerSocket = new WebSocket.Server({
    port: 8080,
    clientTracking: true
});

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
                ws.position = {
                    x: 0,
                    y: 0
                };
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

            case "enemyCoordinates":
                enemies[message.id].x = message.x;
                enemies[message.id].y = message.y;

                for (let client of ServerSocket.clients) {

                    if (client.id != message.clientId) {

                        // We'll want to optimise this by only sending across the coordinates of the enemies that have changed
                        client.send(JSON.stringify({
                            type: "syncEnemies",
                            enemies: enemies
                        }));

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

                for (let i = 0; i < commands.length; i++) {

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

// Database connector

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// Don't commit with the password like this
const uri = "mongodb+srv://Oli:Java12345@f28wp.ofdqn.mongodb.net/f28wp?retryWrites=true&w=majority";


// This is pretty much just a test method
app.get("/users", (request, response) => {

    MongoClient.connect(uri, (error, client) => {

        if (error)
            return;

        const database = client.db('f28wp');
        const collection = database.collection('users');
        collection.find({}).toArray((error, result) => {

            if (!error)
                response.send(result);

        });

        client.close();

    });

});

app.get("/login", async (request, response) => {

    let username = request.query.username;
    let password = request.query.password;

    MongoClient.connect(uri, (error, client) => {

        if (error)
            return;

        const database = client.db('f28wp');
        const collection = database.collection('users');

        // Search the database to see if the user exists
        collection.findOne({
            username: username
        }, (error, result) => {

            if (error) {

                // Server error
                response.status(500);
                response.send(error);
                return;

            } else {

                if (result) {

                    // User exists so we compare the password against the hash stored in the database
                    bcrypt.compare(password, result.password, (error, matches) => {

                        if (error) {

                            // Server error
                            response.status(500);
                            response.send(error);
                            return;

                        } else {

                            if (matches) {

                                response.status(200);
                                response.send("Password matches");

                            } else {

                                response.status(401);
                                response.send("Username/password combination doesn't exist");
                                return;

                            }

                        }

                    });

                } else {

                    // User doesn't exist
                    response.status(404);
                    response.send("Username/password combination doesn't exist");
                    return;

                }

            }

        });

        client.close();

    });

});

app.post("/create-account", (request, response) => {

    let username = request.query.username;
    let password = request.query.password;

    if (!username || !password) {

        response.status(400);
        response.send("Please supply a username and password");
        return;

    }

    MongoClient.connect(uri, {
        poolSize: 10
    }, (error, client) => {

        if (error)
            return;

        const database = client.db('f28wp');
        const collection = database.collection('users');

        // Search the database to see if the username already exists
        collection.findOne({
            username: username
        }, (error, result) => {

            if (error) {

                // Server error
                response.status(500);
                response.send(error);
                client.close();
                return;

            } else {

                if (result) {

                    // User already exists
                    response.status(409);
                    response.send("Error - Username is taken");
                    client.close();
                    return;

                } else {

                    bcrypt.hash(password, 8, (error, hash) => {

                        if (error) {

                            // Server error
                            response.status(500);
                            response.send(error);
                            client.close();
                            return;

                        } else {

                            collection.insertOne({
                                username: username,
                                password: hash
                            }, (error, result) => {

                                if (error) {

                                    // Server error
                                    response.status(500);
                                    response.send(error);
                                    client.close();
                                    return;

                                } else {

                                    // User created successfully
                                    response.status(201);
                                    response.send("User created");
                                    client.close();
                                    return;

                                }

                            });

                        }

                    });

                }

            }

        });

    });

});

app.listen(8081);




console.log("Game Server started on port 8080");
console.log("Database connector started on port 8081");
console.log("Type 'help' to see available commands");