function login() {

    // Sorry we're sending the password in plaintext but I was running out of time
    // At least it gets hashed before being stored on the server
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let url = "http://localhost:8081/login?username=" + username + "&password=" + password;

    callApi("GET", url, (data, status) => {

        if (status == 200) {

            window.location = "/game/index.html?username=" + data.username + "&token=" + data.token;

        } else {

            alert(data.error);

        }

    });

}

function createAccount(class_) {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // We perform validation on the server - client side validation would be pretty useless here
    let url = "http://localhost:8081/create-account?username=" + username + "&password=" + password + "&class=" + class_;

    callApi("POST", url, (data, status) => {

        if (status == 201) {

            window.location = "/game/index.html?username=" + data.username + "&token=" + data.token;

        } else {

            alert(data.error);

        }

    });

}

const callApi = async (method, url, callback) => {

    try {

        const response = await fetch(url, {
            method: method
        });

        const responseData = await response.json();

        callback(responseData, response.status);

    } catch (e) {

        console.error(e);

    }

};