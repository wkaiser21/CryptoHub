let table = document.getElementById("portfolioTable");

fetch("/portfolio", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        // username: usernameInput.value,
        // plaintextPassword: passwordInput.value,
    })
}).then((response) => {
    if (response.status === 200) {
        console.log("Portfolio(s) found");
        
        
    } else {
        console.log("No portfolios found");
    }
});
