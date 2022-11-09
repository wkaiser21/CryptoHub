const axios = require("axios");
const express = require("express");
const pg = require("pg");
const bcrypt = require("bcrypt");
const env = require("../env.json");
const app = express();
const port = 3000;
const hostname = "localhost";

const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});
app.use(express.static("public"));
app.use(express.json());

let salt = 5;
// let pool = new Pool(env);
// pool.connect().then(() => {
//     console.log("Connected to database");
// });

app.get("/" , (req, res) => {
    res.redirect('/login.html');
});


app.get("/search", (req, res) =>{
    if(!(req.query.hasOwnProperty("coin"))){
         res.status(400).json({error: "Invalid origin or destination"});
    }
    else{
        let reqcoin = req.query.coin; 
        axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${reqcoin}&vs_currencies=usd`)
        .then((response) => {
        console.log(Object.keys(response.data) + ' ' + response.data[reqcoin].usd);
        res.status(200).json(response.data); 
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
    pool.query(`SELECT * FROM users WHERE username = '${username}'`)
    .then((result) => {
        if (result.rows.length != 0) {
            res.status(401).send();
        }})

    bcrypt
        .hash(password, salt)
        .then((hashedPassword) => {
            pool.query(`INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`)
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
    pool.query(`SELECT * FROM users WHERE username = '${username}'`)
    .then((result) => {
        if (result.rows.length === 0) {
            return res.status(401).send();
        }
        let hashedPassword = result.rows[0].password;
        bcrypt
            .compare(enteredPassword, hashedPassword)
            .then((correctPassword) => {
                if (correctPassword) {
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

app.get("/portfolio", (req, res) => {
    let username = req.body.username;
    pool.query(`SELECT * FROM portfolio WHERE username = $1`, [username]
        ).then((result) => {
            res.status(200);
            res.send({"rows":result.rows})
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





