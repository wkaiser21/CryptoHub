let username = document.getElementById("username");
let password = document.getElementById("password");
let submit = document.getElementById("submit");
let message = document.getElementById("message");

submit.addEventListener("click", submitCreateAccount);


function submitCreateAccount() {
    
    fetch("/create", {
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
        message.innerText = "Username already exists"
        } 
        if(body.status === 400) {
            message.innerText = "Username or password invalid, username must be less than 15 characters and password must be greater than 5 and less than 36 characters"
        }
        if(body.status === 200) {
        message.innerText = "Account created successfully" }
        }).catch((error) => {
        console.log(error);
    });
}



