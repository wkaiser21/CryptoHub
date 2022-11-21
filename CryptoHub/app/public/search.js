//all things for portfolio add
let addCoinButton = document.getElementById("addsubmit");
var currentPrice;

addCoinButton.addEventListener("click", () => {
    let username = document.cookie.split("=")[1];
    let portfolio = document.getElementById("pickPortfolio");
    let coinSelected = document.getElementById("addCoins").value;
    let coinAmount = document.getElementById("addamount");

    sendurl = "/tablesearch?coin="+coinSelected; 

    fetch(sendurl)
        .then(res => res.json())
        .then(body => { 
            currentPrice = body.data["current_price"];
            console.log("Live Price Inside Fetch: " + currentPrice);

        fetch("/addToPortfolio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                portfolio: portfolio.value,
                coin: coinSelected,
                amount: coinAmount.value,
                value: currentPrice
            }),
        })
        .then(response => response)
        .then(body => { 
            console.log(body.status);
            if(body.status === 400) {
                addMessage.innerText = "400 Error"
            }
            if(body.status === 200) {
            addMessage.innerText = "Added to portfolio successfully" }
            }).catch((error) => {
            console.log(error);
        });
        })
});

// all things for table search 
let TablesearchButton = document.getElementById("tablesubmit"); 

TablesearchButton.addEventListener("click", () =>{
    let selectedcointable = document.getElementById("tableCoins").value;
    let messageDiv = document.getElementById("tablemessage"); 
    let useramount = document.getElementById("amount");
    let tableresponsestat; 
    let tablesendurl; 

    console.log("Selected Coin:" + selectedcointable); 
    tablesendurl = "/tablesearch?coin="+selectedcointable; 
    console.log("Send URL:" + tablesendurl); 

    
    console.log("type of " + typeof(useramount)); 
    messageDiv.innerText = useramount; 
    
    fetch(tablesendurl).then((response) => {
        tableresponsestat = response.status; 
        return response.json(); 
    }).then((body) => {

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        if(tableresponsestat != 200){
            console.log("Error: ", body.error); 
        }  
        else{
            console.log("BODY STUFF: ", body.data); 
            let cointable = document.getElementById("results"); 
            let coinrow = document.createElement("tr");
            let coinselected = document.createElement("td");
            coinselected.textContent = body.data["name"];
            let coinvalue = document.createElement("td");
            coinvalue.textContent = "$"+body.data["current_price"];//change to coin value
            let mktcapval = document.createElement("td");
            mktcapval.textContent = "$"+body.data["market_cap"];
            let m24hval = document.createElement("td");
            m24hval.textContent = "$"+body.data["high_24h"];
            let m24lval = document.createElement("td");
            m24lval.textContent = "$"+body.data["low_24h"];
            let timeof = document.createElement("td");
            timeof.textContent = dateTime //change to the time recived coin data
            coinrow.appendChild(coinselected);
            coinrow.appendChild(coinvalue);
            coinrow.appendChild(mktcapval);
            coinrow.appendChild(m24hval);
            coinrow.appendChild(m24lval);
            coinrow.appendChild(timeof);
            cointable.appendChild(coinrow);
        } 
     })
}); 


//graph search stuff. 
let GraphsearchButton = document.getElementById("graphsubmit"); 

GraphsearchButton.addEventListener("click", () =>{
    let selectedcoingraph = document.getElementById("graphCoins").value;
    let SelectedGraphTime = document.getElementById("graphtime").value;
    let Display = document.getElementById('DisplayGraph');
    let graphtodate = Date.now(); //add today UTC day 
    let graphfromdate = graphtodate - SelectedGraphTime; //do the utc math with selectedgraphtime 
    console.log("FROM DATE: ", graphfromdate); 
    console.log("TO DATE: ", graphtodate); 
    let graphsendurl = "/tablesearch?coin=" + selectedcoingraph + "?from=" + graphfromdate + "?to=" + graphtodate;
    console.log("SEND URL", graphsendurl); 
    let graphresponsestat; 
    let xaxis; 
    let yaxis; 
    



   //https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=1392577232&to=1422577232

   //finish the fetch
   fetch(graphsendurl).then((response) => {
    graphresponsestat = response.status; 
    return response.json(); 
    }).then((body) => {
        if(graphresponsestat != 200){
            console.log("Error: ", body.error); 
        }
        else{
            console.log("BODY STUFF: ", body.data); 
            //do axis stuff 
            Plotly.newPlot( Display, [{
                x: [1, 2, 3, 4, 5],
                y: [1, 2, 4, 8, 16] }], {
                margin: { t: 0 } } ); 

        }


    }); 


    }); 

