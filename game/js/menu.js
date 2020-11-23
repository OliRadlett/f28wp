function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let url = "http://localhost:8081/login?username=" + username + "&password=" + password;

    callApi("GET", url, (data) => {

        document.getElementById("debug").innerText = data;

    });

}

function createAccount() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let url = "http://localhost:8081/create-account?username=" + username + "&password=" + password;

    callApi("POST", url, (result) => {

        alert(result);

    });

}

const callApi = async (method, url, callback) => {

    try {

        const response = await fetch(url, {
            method: method
        });

        // const responseData = await response.json();
        const responseData = await response.text();

        callback(responseData);

    } catch (e) {

        console.error(e);

    }

};