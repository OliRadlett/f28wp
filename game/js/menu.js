function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let url = "http://localhost:8081/login?username=" + username + "&password=" + password;

    callApi(url, (data) => {

        document.getElementById("debug").innerText = data;

    });

}

const callApi = async (url, callback) => {

    try {

        const response = await fetch(url);

        // const responseData = await response.json();
        const responseData = await response.text();

        callback(responseData);

    } catch (e) {

        console.error(e);

    }

};