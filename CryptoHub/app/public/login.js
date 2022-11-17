let username = document.getElementById("username");
let password = document.getElementById("password");
let login = document.getElementById("login");
let logout = document.getElementById("logout");
let message = document.getElementById("message");
let logoutMessage = document.getElementById("logoutMessage");

login.addEventListener("click", submitLogin);
logout.addEventListener("click", submitLogout);

function submitLogin() {
    
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value,
        }),
    }).then(response => response)
    .then(body => { 
        console.log(body.status);
        if(body.status === 401) {
        message.innerText = "Username or Password didn't match"
        } if(body.status === 200) {
        message.innerText = "Logged in successfully" }
        }).catch((error) => {
        console.log(error);
    });
}


function submitLogout() {
    fetch("/logout", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    logoutMessage.innerText = "Logged out successfully"
}
