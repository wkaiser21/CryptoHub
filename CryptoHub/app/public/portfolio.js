let table = document.getElementById("portfolioTable");

fetch("/portfolio", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    // body: JSON.stringify({
    //     username: username.value,
    //     password: password.value,
    // }),
}).then(response => response)
.then(body => { 
    console.log(body.status);
    if (body.status === 401) {
        message.textContent = "No portfolios"
    } 
    if (body.status === 200) {
        message.textContent = "Portfolio(s) found" 
    }
    }).catch((error) => {
    console.log(error);
});