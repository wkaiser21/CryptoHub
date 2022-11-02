let axios = require("axios");
let express = require("express");
//let env = require("../env.json");
let app = express();
let port = 3000;
let hostname = "localhost";
app.use(express.static("public"));
app.use(express.json());
let { Pool } = require("pg");


// let pool = new Pool(env);
// pool.connect().then(() => {
//     console.log("Connected to database");
// });




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

    if(username.length <= 15 && password.length >= 1){
        pool.query(`INSERT INTO Users (username, password) VALUES ('${username}', '${password}')`);
        console.log(req.body);
    }   else {
        res.status(400).json(res.status);
    }
});

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});





