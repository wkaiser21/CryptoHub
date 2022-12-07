let table = document.getElementById("portfolioTable");
let pName = document.getElementById("pName");
let removeCoinButton = document.getElementById("removesubmit");
let username = document.cookie.split("=")[1];
let portfolios = document.getElementById("portfolioList");
var currentPrice;
let portfolioSelect = document.getElementById("portfolioSelect");
let getTransactions = document.getElementById("getTransactions");
let tbody = document.getElementById("returnedPortfolio");
let tbody2 = document.getElementById("returnedPortfolioTransactions");


fetch("/portfolio", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        username: username
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

function grabPortfolios() {fetch("/grabPortfolios" , {
    method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
        }),
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            console.log("Not status 200");
        }})
    .then(body => {
        let portfolioList = [];
        let portfolioData;
        portfolioData = body;
        let portfolioDropdown = document.getElementById("portfolioNames");
        let portfolioDropdown2 = document.getElementById("portfolioNames2");
        for (i = 0; i < portfolioData.length; i++) {
            let option = document.createElement("option");
            option.setAttribute('value', portfolioData[i]);
            let optionText = document.createTextNode(portfolioData[i]);
            option.appendChild(optionText);
            portfolioDropdown.appendChild(option);
            portfolioList.push(portfolioData[i]);

            let option2 = document.createElement("option");
            option2.setAttribute('value', portfolioData[i]);
            let optionText2 = document.createTextNode(portfolioData[i]);
            option2.appendChild(optionText2);
            portfolioDropdown2.appendChild(option2);
        }
        portfolios.textContent = portfolioList;

        let selectedP = portfolioDropdown.value;
        let selectedP2 = portfolioDropdown2.value;

        portfolioSelect.addEventListener("click", () => {
            console.log(portfolioDropdown.value);

            fetch("/returnSelectedPortfolio" , {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                },
                    body: JSON.stringify({
                    username: username,
                    selectedP: portfolioDropdown.value
                }),
             })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.log("Not status 200");
                }})
            .then(body => {
                console.log(body);
                tbody.innerHTML = "";
                for(i = 0; i < body.length; i++) {
                    let addRow = returnedPortfolio.insertRow(0);
                    let addCell = addRow.insertCell(0);
                    let addCell2 = addRow.insertCell(1);
                    let addCell3 = addRow.insertCell(2);
                    let addCoin = document.createTextNode(body[i].coin);
                    let addSum = document.createTextNode(parseInt(body[i].sum).toLocaleString("en-US"));
                    let addValue = document.createTextNode("$ " + parseFloat(body[i].value).toLocaleString("en-US"));
                    if (body[i].sum < 0 || body[i].value < 0) {
                        addSum = document.createTextNode("0");
                        addValue = document.createTextNode("$ 0.00");
                    }
                    addCell.appendChild(addCoin);
                    addCell2.appendChild(addSum);
                    addCell3.appendChild(addValue);
                }
            }).catch((error) => {
            console.log("error " + error);
            })});

            getTransactions.addEventListener("click", () => {

                fetch("/returnPortfolioTransactions" , {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                    },
                        body: JSON.stringify({
                        username: username,
                        selectedP2: portfolioDropdown2.value
                    }),
                 })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        console.log("Not status 200");
                    }})
                .then(body => {
                    console.log(body);
                    tbody2.innerHTML = "";
                    for(i = 0; i < body.length; i++) {
                        let addRow = returnedPortfolioTransactions.insertRow(0);
                        let addCell = addRow.insertCell(0);
                        let addCell2 = addRow.insertCell(1);
                        let addCell3 = addRow.insertCell(2);
                        let addCell4 = addRow.insertCell(3);
                        let addCoin = document.createTextNode(body[i].coin);
                        let addAmount = document.createTextNode(parseInt(body[i].amount).toLocaleString("en-US"));
                        let addValue = document.createTextNode("$ " + parseFloat(body[i].value).toLocaleString("en-US"));
                        let addDate = document.createTextNode(body[i].date)
                        addCell.appendChild(addCoin);
                        addCell2.appendChild(addAmount);
                        addCell3.appendChild(addValue);
                        addCell4.appendChild(addDate);
                    }
                }).catch((error) => {
                console.log("error " + error);
                })});
        }).catch((error) => {
        console.log("error " + error);
})};

grabPortfolios();

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

        fetch("/removeFromPortfolio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                portfolio: portfolio.value,
                coin: coinSelected,
                amount: -coinAmount.value,
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


