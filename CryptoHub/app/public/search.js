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
            addMessage.innerText = "Added to portfolio successfully" 
            coinAmount.value = "";
            }
            }).catch((error) => {
            console.log(error);
        });
        })
});

// all things for table search 
function updatetablefunct(){
    let tableresponsestat; 
    let tablesendurl; 
    let avaliblecoins = ["bitcoin", "ethereum", "ripple", "eos"]; 

    let worktable = document.getElementById("cointable"); 
    while(worktable.children.length > 1){
        worktable.removeChild(worktable.lastChild);
    }


    for(let thiscoin of avaliblecoins){

        tablesendurl = "/tablesearch?coin="+thiscoin; 
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
                let tr = document.createElement('tr'); 
                let coinselected = document.createElement('td'); 
                let coinvalue = document.createElement('td'); 
                let mktcapval = document.createElement('td'); 
                let m24hval = document.createElement('td'); 
                let m24lval = document.createElement('td'); 
                let timeof = document.createElement('td'); 
                let coinvaluefromapi = body.data["current_price"];
                let mktcapvalfromapi = body.data["market_cap"];
                let m24hvalfromapi = body.data["high_24h"];
                let m24lvalfromapi = body.data["low_24h"];
                coinselected.textContent = body.data["name"];
                coinvalue.textContent = "$"+coinvaluefromapi.toLocaleString();
                mktcapval.textContent = "$"+mktcapvalfromapi.toLocaleString();
                m24hval.textContent = "$"+m24hvalfromapi.toLocaleString();
                m24lval.textContent = "$"+m24lvalfromapi.toLocaleString();
                timeof.textContent = dateTime 
                tr.appendChild(coinselected);
                tr.appendChild(coinvalue);
                tr.appendChild(mktcapval);
                tr.appendChild(m24hval);
                tr.appendChild(m24lval);
                tr.appendChild(timeof);
               document.getElementById("cointable").append(tr); 
               worktable.appendChild(tr); 
            //document.body.appendChild("cointable"); 
            }
        })
    }
}


//run when page loads 
// window.onload = (event) => {
//     updatetablefunct(); 
//   };
updatetablefunct(); //DO NOT REMOVE

let TablesearchButton = document.getElementById("tablesubmit"); 
TablesearchButton.addEventListener("click", () =>{
    updatetablefunct(); 

}); 


//graph search stuff. 
let GraphsearchButton = document.getElementById("graphsubmit"); 

GraphsearchButton.addEventListener("click", () =>{
    let selectedcoingraph = document.getElementById("graphCoins").value;
    let SelectedGraphTime = document.getElementById("graphtime").value;
    let Display = document.getElementById('DisplayGraph');
    let graphtodate = Math.floor(Date.now()/1000); //add today UTC day 
    let graphfromdate = graphtodate - SelectedGraphTime; //do the utc math with selectedgraphtime 
    console.log("FROM DATE: ", graphfromdate); 
    console.log("TO DATE: ", graphtodate); 
    let graphsendurl = "/graphsearch?coin=" + selectedcoingraph + "&from=" + graphfromdate + "&to=" + graphtodate;
    console.log("SEND URL", graphsendurl); 
    let graphresponsestat; 
    let xaxis = []; 
    let yaxis = []; 

   //https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=1392577232&to=1422577232
   fetch(graphsendurl).then((response) => {
    graphresponsestat = response.status; 
    return response.json(); 
    }).then((body) => {
        if(graphresponsestat != 200){
            console.log("Error: ", body.error); 
        }
        else{
            console.log("BODY STUFF: ", body.data.prices); 
            let returnprices = body.data.prices; 
            //do axis stuff 
            for( let item = 0; item < returnprices.length; item++ ){
                xaxis.push(new Date(returnprices[item][0])); 
                yaxis.push(returnprices[item][1]); 
            }
            
            Plotly.newPlot( Display, [{
                x: xaxis,
                y: yaxis }], {
                margin: { t: 0 }, xaxis : {title : {text: "Time"}},  yaxis : {title : {text: "Value (USD)"}} } ); 

        }


    }); 


    }); 

