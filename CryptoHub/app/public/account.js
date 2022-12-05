let accountName = document.getElementById("accountName");
let accountValue = document.getElementById("accountValue");
let ethValue = document.getElementById("ethereumValue");
let bitValue = document.getElementById("bitcoinValue");
let eosValue = document.getElementById("eosValue");
let rippleValue = document.getElementById("rippleValue");
let username = document.cookie.split("=")[1];
let logout = document.getElementById("logout");
let totalValue = 0;
let ethPercentage = 0;
let bitPercentage = 0;
let eosPercentage = 0;
let rippplePercentage = 0;


logout.addEventListener("click", submitLogout);

accountName.textContent = (username + "'s" + " Account");

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

    accountValue.textContent = ("Total Account Value: " + "$" + data.toLocaleString());
})

//grab eth value
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


//grab bit value
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
        return response.json();
    } else {
        console.log("No Account found");
    }
}).then(data => {
    bitPercentage = data / totalValue;
    bitValue.textContent = ("Bitcoin Value: " + "$" + data.toLocaleString());
})


//grab eos value
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


//grab ripple value
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
    


let Display = document.getElementById('DisplayPieGraph');

const coinInfo = [{
    values: [bitPercentage, ethPercentage, rippplePercentage,eosPercentage],
    labels: ['Bitcoin', 'Ethereum', 'Ripple', 'EOS'],
    type: 'pie'
  }];
  
  const layout = {
    height: 400,
    width: 500
  };
  
Plotly.newPlot(Display, coinInfo, layout);
})



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

