//all things for portfolio add

// all things for table search 
let TablesearchButton = document.getElementById("tablesubmit"); 

TablesearchButton.addEventListener("click",() =>{
    let selectedcoin = document.getElementById("Coins").value;
    let useramount = document.getElementById("amount"); 
    let messageDiv = document.getElementById("message"); 
    let responsestat; 
    let sendurl; 

    console.log("Selected Coin:" + selectedcoin); 
    sendurl = "/search?coin="+selectedcoin; 
    console.log("Send URL:" + sendurl); 

    
    console.log("type of " + typeof(useramount)); 
    messageDiv.innerText = useramount; 
    
    fetch(sendurl).then((response) => {
        responsestat = response.status; 
        return response.json(); 
    }).then((body) => {

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        if(responsestat != 200){
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


