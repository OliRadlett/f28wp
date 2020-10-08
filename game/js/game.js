let player;

function start() {

    player = new Player();
    window.requestAnimationFrame(update);

}

function update(delta) {


    // Player movement code

    if (UP) {

        player.up();
        ContentDown("background");

    }

    if (DOWN) {

        player.down();
        ContentUp("background");

    }

    if (LEFT) {

        player.left();
        ContentRight("background");

    }

    if (RIGHT) {

        player.right();
        ContentLeft("background");
    }

    // console.log(player.getX + " " + player.getY)

    window.requestAnimationFrame(update);

}

function getCoordinates(id) {

    let element = document.getElementById(id);
    let left = parseInt(element.style.left.replace("px", ""), 10);
    let top = parseInt(element.style.top.replace("px", ""), 10);

    // Maybe do some world space calculations here

    return {
            left: left, 
            top: top
        };

}

function ContentDown(d) {

    var items = document.body.getElementsByTagName("*");

    for (var i = 0, len = items.length; i < len; i++) {
            
        if (items[i].className !== "player") {
    
            var currentPosition = parseInt(items[i].style.top);
            items[i].style.top = currentPosition + player.getSpeed +"px";
    
        }

    }

}

function ContentUp(d) {

    var items = document.body.getElementsByTagName("*");

    for (var i = 0, len = items.length; i < len; i++) {
            
        if (items[i].className !== "player") {
    
            var currentPosition = parseInt(items[i].style.top);
            items[i].style.top = currentPosition + -player.getSpeed + "px";
        }

    }

}

function ContentRight(d) {

    var items = document.body.getElementsByTagName("*");

    for (var i = 0, len = items.length; i < len; i++) {
            
        if (items[i].className !== "player") {
    
            var currentPosition = parseInt(items[i].style.left);
            items[i].style.left = currentPosition + player.getSpeed + "px";
        
        }

    }

}

function ContentLeft(d) {

    var items = document.body.getElementsByTagName("*");

    for (var i = 0, len = items.length; i < len; i++) {
            
        if (items[i].className !== "player") {
    
            var currentPosition = parseInt(items[i].style.left);
            items[i].style.left = currentPosition + -player.getSpeed + "px";
        
        }

    }

}

