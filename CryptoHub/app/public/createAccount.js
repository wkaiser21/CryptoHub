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
    }).then(response => response.text())

    //message.insertAdjacentHTML('message', '<div>success</div>');
}



