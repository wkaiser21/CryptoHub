
let searchButton = document.getElementById("submit"); 

searchButton.addEventListener("click",() =>{
    let selectedcoin = document.getElementById("Coins").options[document.getElementById("Coins").selectedIndex].value; 
    console.log("Selected Coin:" + selectedcoin); 
    let sendurl = "/search?coin="+selectedcoin; 
    console.log("Send URL:" + sendurl); 

    let responsestat; 
    fetch(sendurl).then((response) => {
        responsestat = response.status; 
        return response.json(); 
    }).then((body) => {

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        if(responsestat != 200){
            console.log("Error: "+ body.error); 
        }  
        else{
            let coinrow = document.createElement("tr");
            let coinselected = document.createElement("td")
            coinselected.textContent = selectedcoin 
            let coinvalue = document.createElement("td")
            coinvalue.textContent = selectedcoin["usd"] //change to coin value
            let timeof = document.createElement("td")
            timeof.textContent = dateTime //change to the time recived coin data
            coinrow.appendChild(coinselected);
            coinrow.appendChild(coinvalue);
            coinrow.appendChild(timeof);
            traintb.appendChild(coinrow);
        } 
     })
}); 