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

