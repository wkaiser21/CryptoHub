const axios = require("axios");
const express = require("express");
const pg = require("pg");
const bcrypt = require("bcrypt");
const env = require("../env.json");
const app = express();
const port = 3000;
const hostname = "localhost";
const cookieParser = require("cookie-parser");
const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

let salt = 5;

app.get("/" , (req, res) => {
    res.redirect('/login.html');
});

app.get("/search", (req, res) =>{
    if(!(req.query.hasOwnProperty("coin"))){
         res.status(400).json({error: "Invalid origin or destination"});
    }
    else{
        let reqcoin = req.query.coin; 
        //axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${reqcoin}&vs_currencies=usd`)
        axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${reqcoin}`)
        .then((response) => {
            //console.log(response.data);
        res.status(200).json({data: response.data[0]}); 
         }); 
    }
}); 

app.post("/addToPortfolio", (req, res) => {
    let username = req.body.username;
    let portfolio = req.body.portfolio;
    let coin = req.body.coin;
    let amount = req.body.amount;
    let value = req.body.value;
    console.log(username);
    console.log(portfolio);
    console.log(coin);
    console.log(amount);
    console.log(value);

    pool.query(`INSERT INTO portfolio (username, portfolio, coin, amount, value, date) VALUES ($1, $2, $3, $4, $5, current_timestamp)`, [username, portfolio, coin, amount, value])
        .then(() => {
            console.log(username, "Inserted Successfully");
            res.status(200).send();
        })
        .catch((error) => {
            console.log(error + "Insert failed");
            res.status(500).send();
        });

    if (portfolio === "Portfolio1") {
        pool.query(`INSERT INTO portfolio1 (username, coin, amount, value, date) VALUES ($1, $2, $3, $4, current_timestamp)`, [username, coin, amount, value])
        .then(() => {
            console.log(username, "Inserted Successfully to portfolio 1");
            res.status(200).send();
        })
        .catch((error) => {
            console.log(error + "Insert failed");
            res.status(500).send();
        });
    }
    else if (portfolio === "Portfolio2") {
        pool.query(`INSERT INTO portfolio2 (username, coin, amount, value, date) VALUES ($1, $2, $3, $4, current_timestamp)`, [username, coin, amount, value])
        .then(() => {
            console.log(username, "Inserted Successfully to portfolio 2");
            res.status(200).send();
        })
        .catch((error) => {
            console.log(error + "Insert failed");
            res.status(500).send();
        });
    }
});

app.post("/create", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username + ' ' + password);
    if(typeof username != 'string' && username.length < 1 && username.length > 15 && password.length < 5 && password.length > 36){
        res.status(400).send();
        console.log(req.body);
    }
    pool.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
        if (result.rows.length != 0) {
            res.status(401).send();
        }})

    bcrypt
        .hash(password, salt)
        .then((hashedPassword) => {
            pool.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [username, hashedPassword])
                .then(() => {
                    console.log(username, "account created");
                    res.status(200).send();
                })
                .catch((error) => {
                    console.log(error + "insert failed");
                    res.status(500).send();
                });
        })
        .catch((error) => {
            console.log(error + "bcrypt failed");
            res.status(500).send();
        });    
});

app.post("/login" , (req, res) => {
    let username = req.body.username;
    let enteredPassword = req.body.password;
    pool.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
        if (result.rows.length === 0) {
            return res.status(401).send();
        }
        let hashedPassword = result.rows[0].password;
        bcrypt
            .compare(enteredPassword, hashedPassword)
            .then((correctPassword) => {
                if (correctPassword) {
                    res.cookie('username', username);
                    console.log(res.cookie);
                    res.status(200).send();
                } else {
                    res.status(401).send();
                }
            })
            .catch((error) => {
                console.log(error + " bcrypt error");
                res.status(500).send();
            });
    })
    .catch((error) => {
        console.log(error + " select error");
        res.status(500).send();
    });
});

app.get("/logout", (req,res) => {
    res.clearCookie('username');
    res.redirect("/login.html");
})

app.post("/portfolio", (req, res) => {
    let loggedInUser = req.cookies.username;
    if (loggedInUser) {
        console.log(loggedInUser);
    }
    pool.query(`SELECT * FROM users WHERE username = $1`, [loggedInUser]
        ).then((result) => {
            data = {username: loggedInUser};
            console.log(data);
            res.status(200);
            res.send(data);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(error);
            res.send();
        });
});

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});