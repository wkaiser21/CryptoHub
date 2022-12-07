let username = document.getElementById("username");
let password = document.getElementById("password");
let login = document.getElementById("login");
let message = document.getElementById("message");

login.addEventListener("click", submitLogin);

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
        message.innerText = "Logged in successfully"
        location.href = "account.html";
        }
        }).catch((error) => {
        console.log(error);
    });
}


