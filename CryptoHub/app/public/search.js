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
            }
        })
    }
}

updatetablefunct();

let TablesearchButton = document.getElementById("tablesubmit"); 
TablesearchButton.addEventListener("click", () =>{
    updatetablefunct(); 

}); 

let GraphsearchButton = document.getElementById("graphsubmit"); 

GraphsearchButton.addEventListener("click", () =>{
    let selectedcoingraph = document.getElementById("graphCoins").value;
   
    var selectedcoins = [];

    for (var option of document.getElementById('graphCoins').options)
    {
        if (option.selected) {
            selectedcoins.push(option.value);
        }
    }
    console.log("SELECTED BUTTONS",selectedcoins); 
    let SelectedGraphTime = document.getElementById("graphtime").value;
    let Display = document.getElementById('DisplayGraph');
    let graphtodate = Math.floor(Date.now()/1000);
    let graphfromdate = graphtodate - SelectedGraphTime;
    console.log("FROM DATE: ", graphfromdate); 
    console.log("TO DATE: ", graphtodate); 
    let graphresponsestat; 
    let btcaxis = []; 
    let ripaxis = []; 
    let ethaxis = []; 
    let eosaxis = [];  
    let yaxis = [];

    for(let currentcoin of selectedcoins){
        let xaxis = []; 

        let graphsendurl = "/graphsearch?coin=" + currentcoin + "&from=" + graphfromdate + "&to=" + graphtodate;
        console.log("SEND URL", graphsendurl); 
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
                for( let item = 0; item < returnprices.length; item++ ){
                    if(currentcoin == "ethereum"){
                         ethaxis.push(returnprices[item][1]);
                    }
                    if(currentcoin == "ripple"){
                         ripaxis.push(returnprices[item][1]);
                    }
                    if(currentcoin == "bitcoin"){
                        btcaxis.push(returnprices[item][1]); 
                    }
                    if(currentcoin == "eos"){
                         eosaxis.push(returnprices[item][1]);
                    }
                    xaxis.push(new Date(returnprices[item][0])); 
                }
                console.log("BTC ARRAY", btcaxis); 
                console.log("ETH ARRAY", ethaxis); 
                console.log("EOS ARRAY", eosaxis); 
                console.log("RIP ARRAY", ripaxis); 
                }
            var trace1 = {
                x: xaxis,
                y: btcaxis,
                name: 'BTC data',
                type: 'scatter'
            };
            
            var trace2 = {
                x: xaxis,
                y: ethaxis,
                name: 'ETH data',
                type: 'scatter'
            };

            var trace3 = {
                x: xaxis,
                y: ripaxis,
                name: 'Ripple data',
                type: 'scatter'
            };

            var trace4 = {
                x: xaxis,
                y: eosaxis,
                name: 'EOS data',
                type: 'scatter'
            };
              
            var data = [trace1, trace2, trace3, trace4];
            
            var layout = {
            title: 'Historic Values',
            yaxis: {title: 'Value (USD)'},
            xaxis: {title: 'Time'}, 
            };
            Plotly.newPlot(Display, data, layout);
         }); 
    }}); 

