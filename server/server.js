const {
    Server
} = require("ws");
const WebSocket = require("ws");
const express = require("express");
const MongoClient = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cryptojs = require("crypto-js");
const readline = require("readline");
const {
    resolve
} = require("path");
const {
    rejects
} = require("assert");

// I know this really really needs to not be in the repo but I'll do it soon
const uri = "mongodb+srv://Oli:Java12345@f28wp.ofdqn.mongodb.net/f28wp?retryWrites=true&w=majority";

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

// When the server is restarted make sure there are at least 100 enemies
MongoClient.connect(uri, (error, client) => {

    if (error) {

        console.log(error);
        return;

    }

    const database = client.db('f28wp');
    const collection = database.collection('enemies');

    collection.countDocuments((error, result) => {

        if (error) {

            console.log(error);
            return;

        }

        if (result < 100) {

            for (let i = result; i < 100; i++) {

                let x = Math.floor((Math.random() * 13888) + 1664);
                let y = Math.floor((Math.random() * 14528) + 512);

                enemies.push({
                    // Idk if i like the length being calculated like this
                    id: enemies.length,
                    type: "melee",
                    x: x,
                    y: y
                });

            }

            collection.insertMany(enemies, (error, result) => {

                if (error) {

                    console.log(error);
                    return;

                }

            });

        }

    });

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

            case "setClass":
                ws.class = message.class;
                break;

            case "clientConnected":
                console.log("Client connected with id " + message.id);
                ws.id = message.id;
                ws.position = {
                    x: message.x,
                    y: message.y
                };
                ws.class = message.class;

                for (let client of ServerSocket.clients) {

                    if (message.id != client.id) {

                        client.send(JSON.stringify({
                            type: "clientConnected",
                            id: message.id,
                            x: message.x,
                            y: message.y,
                            class: message.class
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
                            y: client.position.y,
                            class: message.class
                        });

                    }

                }

                // ws represents the client that just connected
                // currentClients contains the clients that were connected at the time ws connected

                ws.send(JSON.stringify(currentClients));
                console.log(JSON.stringify(currentClients));
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
    extended: false,
}));
app.use(bodyParser.json());
// Don't commit with the password like this

// Remember to do some kind of input validation here
// Theres probably a npm module for this

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
                response.send({
                    error: error
                });
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

                                let token = cryptojs.AES.encrypt(result.username, result.key).toString();
                                response.status(200);
                                response.send({
                                    username: result.username,
                                    token: token,
                                    newPlayer: result.newPlayer
                                });

                            } else {

                                response.status(401);
                                response.send({
                                    error: "Username/password combination doesn't exist"
                                });
                                return;

                            }

                        }

                    });

                } else {

                    // User doesn't exist
                    response.status(404);
                    response.send({
                        error: "Username/password combination doesn't exist"
                    });
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
    let class_ = request.query.class;

    let classes = ["archer", "knight", "wizard"];

    if (!username || !password || !class_) {

        response.status(400);
        response.send({
            error: "Please supply a username and password"
        });
        return;

    }

    // Check that class is allowed
    if (!class_ in classes) {

        response.status(400);
        response.send("Class doesn't exist");
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
                    response.send({
                        error: "Error - Username is taken"
                    });
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

                            bcrypt.hash(new Date().toString(), 8, (error, key) => {

                                if (error) {

                                    // Server error
                                    response.status(500);
                                    response.send(error);
                                    client.close();
                                    return;

                                }

                                let token = cryptojs.AES.encrypt(username, key).toString();

                                collection.insertOne({
                                    username: username,
                                    password: hash,
                                    key: key,
                                    newPlayer: true,
                                    // Define the coordinates so that they can be updated in /save
                                    x: 0,
                                    y: 0,
                                    class: class_
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
                                        response.send({
                                            username: username,
                                            token: token
                                        });
                                        client.close();
                                        return;

                                    }

                                });

                            });


                        }

                    });

                }

            }

        });

    });

});

app.post("/verify", (request, response) => {

    /*
    We can verify that a user has logged in by attempting to decrypt their login token with a unique secret key
    that was generated when they first made the account.

    If the result of the decryption is the same as the username of current logged in user then we know they've logged
    in and not just changed the username variable
    */



    // Note we send the parameters as part of the body instead of the as URL parameters because URL encoding will break the tokens
    let username = request.body.username;
    let token = request.body.token;

    if (!username || !token) {

        response.status(404);
        response.send({
            error: "Username or token missing"
        });
        return;

    }

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

                    let key = result.key;
                    let bytes = cryptojs.AES.decrypt(token, key);
                    let decrypted = bytes.toString(cryptojs.enc.Utf8);

                    if (decrypted === result.username) {

                        response.status(200);
                        response.send({
                            verified: true,
                            newPlayer: result.newPlayer,
                            x: result.x,
                            y: result.y,
                            class: result.class
                            // etc.
                        });

                    } else {

                        response.status(403);
                        response.send({
                            verified: false
                        });

                    }

                } else {

                    response.status(404);
                    response.send({
                        verified: false
                    });

                }

            }

        });

    });

});

app.post("/save", (request, response) => {

    let player = request.body.player;

    MongoClient.connect(uri, (error, client) => {

        if (error)
            return;

        const database = client.db('f28wp');
        const collection = database.collection('users');

        // Search the database to see if the user exists
        collection.findOne({
            username: player.username
        }, (error, result) => {

            if (error) {

                // Server error
                response.status(500);
                response.send(error);
                return;

            } else {

                if (result) {

                    let key = result.key;
                    let bytes = cryptojs.AES.decrypt(player.token, key);
                    let decrypted = bytes.toString(cryptojs.enc.Utf8);

                    if (decrypted === result.username) {

                        // Now we can save
                        // We don't use findAndUpdate because we need to verify the token first
                        collection.updateOne({
                            username: player.username
                        }, {
                            $set: {
                                x: player.x,
                                y: player.y,
                                // New player is always set to false here
                                newPlayer: false
                                // etc...
                            }
                        }, (error, result) => {

                            if (error) {

                                response.status(500);
                                response.send(error);
                                return;

                            }

                            response.status(201);
                            response.send({
                                status: "ok"
                            });
                            return;

                        });

                    }

                }

            }

        });

    });

});

app.listen(8081);




console.log("Game Server started on port 8080");
console.log("Database connector started on port 8081");
console.log("Type 'help' to see available commands");