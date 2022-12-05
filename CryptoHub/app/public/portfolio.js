let table = document.getElementById("portfolioTable");
let pName = document.getElementById("pName");
let removeCoinButton = document.getElementById("removesubmit");
var currentPrice;

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
        return response.json();
    }
}).then(data => {
    if(data.username != undefined) {
        pName.textContent = (data.username + "'s" + " Portfolio");
    } else {
        pName.textContent = ("User Not Logged In, Please Log In");
    }
})

//TODO dynamically update portfolios list in dropdown when page loads
let username = document.cookie.split("=")[1];
fetch("/grabPortfolios" , {
    method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
        }),
    })
    .then(response => response)
    .then(body => {
        if(body.status === 200) {
        //need to loop through result.rows and grab oject valuels for portfolio names
        //for (let i = 0; i < body.length; i++) {}
        console.log(body);
        }
        }).catch((error) => {
        console.log(error);
});


//all things for portfolio removing
removeCoinButton.addEventListener("click", () => {
    let username = document.cookie.split("=")[1];
    let portfolio = document.getElementById("pickPortfolio");
    let coinSelected = document.getElementById("removeCoins").value;
    let coinAmount = document.getElementById("removeamount");
    sendurl = "/tablesearch?coin="+coinSelected;

    fetch(sendurl)
        .then(res => res.json())
        .then(body => { 
            currentPrice = body.data["current_price"];
            console.log("Live Price Inside Fetch: " + currentPrice);

        fetch("/removeFromPortfolio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                portfolio: portfolio.value,
                coin: coinSelected,
                amount: coinAmount.value,
                value: (-currentPrice)
            }),
        })
        .then(response => response)
        .then(body => { 
            console.log(body.status);
            if(body.status === 400) {
                addMessage.innerText = "400 Error"
            }
            if(body.status === 200) {
            addMessage.innerText = "Added to portfolio successfully" 
            coinAmount.value = "";
            }
            }).catch((error) => {
            console.log(error);
        });
        })
});

let GraphsearchButton = document.getElementById("graphsubmit"); 
GraphsearchButton.addEventListener("click", () =>{
    let Display = document.getElementById('DisplayGraph');
    let selectedcoingraph = document.getElementById("ChartCoins").value;
    let selectedportfoliograph = document.getElementById("pickPortfolio").value;
    let graphsendurl = "/portfolioinfo?coin=" + selectedcoingraph + "&portfolio=" + selectedportfoliograph;
    let graphresponsestat; 
    let xaxis = []; 
    let yaxis = []; 

    fetch(graphsendurl).then((response) => {
        graphresponsestat = response.status; 
        return response.json(); 
        }).then((body) => {        
            if(graphresponsestat != 200){
                console.log("Error: ", body.error); 
            }
            else{ 
                //parse data into axis
                //change plotly to use that info
                Plotly.newPlot( Display, [{
                    x: [1, 2, 3, 4, 5],
                    y: [1, 2, 4, 8, 16] }], {
                    margin: { t: 0 } } ); 
            }
            }) 
}); 

