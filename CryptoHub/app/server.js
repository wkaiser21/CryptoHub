const axios = require("axios");
const express = require("express");
const pg = require("pg");
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


// let pool = new Pool(env);
// pool.connect().then(() => {
//     console.log("Connected to database");
// });

app.get("/" , (req, res) => {
    res.redirect('http://localhost:3000/login.html');
});


app.get("/search", (req, res) =>{
    if(!(req.query.hasOwnProperty("coin"))){
       // console.log("test1"); 
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
    if(username.length <= 15 && password.length >= 1){
        pool.query(`INSERT INTO Users (username, password) VALUES ('${username}', '${password}')`);
        console.log(req.body);
    }   else {
        res.status(400).json(res.status);
    }
});


app.post("/login" , (req, res) => {
    let username = req.body.username;
    let enteredPassword = req.body.password;
    pool.query(`SELECT * FROM users WHERE username = '${username}' and password = '${enteredPassword}'`)
    .then((result) => {
        console.log(result.rows)
        if (result.rows.length === 0) {
            console.log("Username or Password didn't match");
            return res.status(401).send();
        } else{
            return res.status(200).send();
        }

    })
    .catch((error) => {
        console.log("select error " + error);
        res.status(500).send();
    });
});

// app.post("/portfolio" , (req, res) => {
//     let username = req.body.username;
//     pool.query(`SELECT * FROM portfolios WHERE username = '${username}'`)
//     .then((result) => {
//         console.log(result.rows)
//         if (result.rows.length === 0) {
//             console.log("No portfolio found");
//             return res.status(401).send();
//         } else{
//             return res.status(200).send();
//         }

//     })
//     .catch((error) => {
//         console.log("select error " + error);
//         res.status(500).send();
//     });
// });

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});





