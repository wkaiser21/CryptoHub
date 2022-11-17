let table = document.getElementById("portfolioTable");
let pName = document.getElementById("pName");
console.log(pName);
fetch("/portfolio", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        // username: usernameInput.value,
        // plaintextPassword: passwordInput.value,
    })
}).then(response => {
    if (response.status === 200) {
        console.log("Portfolio(s) found");
        return response.json();
    } else {
        console.log("No portfolios found");
    }
}).then(data => {
    if(data.username != undefined) {
        pName.textContent = (data.username + "'s" + " Portfolio");
        console.log(data.username);
    } else {
        pName.textContent = ("User Not Logged In, Please Log In");
    }
})


