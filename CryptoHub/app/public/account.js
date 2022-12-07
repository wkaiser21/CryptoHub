let accountName = document.getElementById("accountName");
let accountValue = document.getElementById("accountValue");
let ethValue = document.getElementById("ethereumValue");
let bitValue = document.getElementById("bitcoinValue");
let eosValue = document.getElementById("eosValue");
let rippleValue = document.getElementById("rippleValue");
let username = document.cookie.split("=")[1];
let logout = document.getElementById("logout");
let accountProfit = document.getElementById("accountProfit");
let percentChange = document.getElementById("percentChange");
let totalValue = 0;
let ethPercentage = 0;
let bitPercentage = 0;
let eosPercentage = 0;
let ripplePercentage = 0;


logout.addEventListener("click", submitLogout);

accountName.textContent = (username + "'s" + " Account Value Across All Portfolios");

fetch("/account", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "username": username
    })
}).then(response => {
    if (response.status === 200) {
        return response.json();
    } else {
        console.log("No Account found");
    }
}).then(data => {
    totalValue += data;
})

fetch("/getEthValue", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "username": username
    })
}).then(response => {
    if (response.status === 200) {
        return response.json();
    } else {
        console.log("No Account found");
    }
}).then(data => { 
    ethPercentage = data / totalValue;
    ethValue.textContent = ("Ethereum Value: " + "$" + data.toLocaleString());
})

fetch("/getBitValue", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "username": username
    })
}).then(response => {
    if (response.status === 200) {
        bitPercentage = 0;
        return response.json();
    }
}).then(data => {
    bitPercentage = data / totalValue;
    bitValue.textContent = ("Bitcoin Value: " + "$" + data.toLocaleString());
})

fetch("/getEosValue", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "username": username
    })
}).then(response => {
    if (response.status === 200) {
        return response.json();
    } else {
        console.log("No Account found");
    }
}).then(data => {
    eosPercentage = data / totalValue;
    eosValue.textContent = ("Eos Value: " + "$" + data.toLocaleString());
})

fetch("/getRippleValue", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "username": username
    })
}).then(response => {
    if (response.status === 200) {
        return response.json();
    } else {
        console.log("No Account found");
    }
}).then(data => {
    ripplePercentage = data / totalValue;
    rippleValue.textContent = ("Ripple Value: " + "$" + data.toLocaleString());
})


function calculateProfitLoss() {
    
    let bitLiveValue;
    let ethLiveValue;
    let eosLiveValue;
    let ripLiveValue;
    let oldAccountSum = 0;

    fetch("/account", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username
        })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            console.log("No Account found");
        }
    }).then(data => {
        oldAccountSum += data;
        
    })

    fetch("/tablesearch?coin="+"bitcoin")
    .then((response) => {
        if (response.status === 200) { 
            return response.json();
        } 
    }).then((body) => {
        bitLiveValue = body.data["current_price"];

    })

    fetch("/tablesearch?coin="+"ethereum")
    .then((response) => {
        if (response.status === 200) { 
            return response.json();
        } 
    }).then((body) => {
        ethLiveValue = body.data["current_price"];

    })

    fetch("/tablesearch?coin="+"eos")
    .then((response) => {
        if (response.status === 200) { 
            return response.json();
        } 
    }).then((body) => {
        eosLiveValue = body.data["current_price"];

    })

    fetch("/tablesearch?coin="+"ripple")
    .then((response) => {
        if (response.status === 200) { 
            return response.json();
        } 
    }).then((body) => {
        ripLiveValue = body.data["current_price"];

        fetch("/getLiveAccountBalance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username
            })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log("No Account found");
            }
        }).then(data => {
            let bitLiveSum;
            let ethLiveSum;
            let eosLiveSum;
            let ripLiveSum;
            let totalSum;

            for (i = 0; i < data.length; i++) {
                if (data[i].coin.startsWith("bitcoin")) {
                    bitLiveSum = data[i].amount * bitLiveValue;
                }
                if (data[i].coin.startsWith("ethereum")) {
                    ethLiveSum = data[i].amount * ethLiveValue;
                }
                if (data[i].coin.startsWith("eos")) {
                    eosLiveSum = data[i].amount * eosLiveValue;
                }
                if (data[i].coin.startsWith("ripple")) {
                    ripLiveSum = data[i].amount * ripLiveValue;
                } 
                else {
                    totalSum = 0;
                }
            }

            let display = document.getElementById('DisplayPieGraph');

            const coinInfo = [{
                values: [bitPercentage, ethPercentage, ripplePercentage, eosPercentage],
                labels: ['Bitcoin', 'Ethereum', 'Ripple', 'EOS'],
                type: 'pie'
              }];
              
              const layout = {
                height: 400,
                width: 500
              };
              
            Plotly.newPlot(display, coinInfo, layout);


            liveAccountSum = bitLiveSum + ethLiveSum + eosLiveSum + ripLiveSum;
            let profitLossPercent;
            if (oldAccountSum === "00") {
                profitLossPercent = (1.01 - liveAccountSum/liveAccountSum);
            } 
            else {
                profitLossPercent = (1.01 - liveAccountSum/oldAccountSum)
            };
            accountValue.textContent = ("Total Account Value: " + "$" + liveAccountSum.toLocaleString());
            bitValue.textContent = ("Bitcoin Value: " + "$" + bitLiveSum.toLocaleString());
            ethValue.textContent = ("Ethereum Value: " + "$" + ethLiveSum.toLocaleString());
            rippleValue.textContent = ("Ripple Value: " + "$" + ripLiveSum.toLocaleString());
            eosValue.textContent = ("Eos Value: " + "$" + eosLiveSum.toLocaleString());
            let difference = liveAccountSum - oldAccountSum;
            if (liveAccountSum >= oldAccountSum) {
                accountProfit.textContent = ("Account Profit is $" + parseFloat(difference).toFixed(2));
            }
            else {
                accountProfit.textContent = ("Account Loss is $" + parseFloat(-difference).toFixed(2));
            }
            percentChange.textContent = (parseFloat(profitLossPercent).toFixed(3) + " % Change")
        })
    })
}    
calculateProfitLoss();


function submitLogout() {
    fetch("/logout", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    logoutMessage.innerText = "Logged out successfully"
    location.href = "login.html";
}

