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

app.post("/grabPortfolios", (req, res) => {
    let username = req.body.username;

    pool.query(`SELECT DISTINCT portfolio FROM portfolio WHERE username = $1`, [username])
        .then((result) => {
            let portfolioNames = [];
            let zero = 0;
            
            for (i = 0; i < result.rows.length; i++) {
                portfolioNames.push(result.rows[i].portfolio);
            }
            res.status(200).send(portfolioNames);
        })
        .catch((error) => {
            console.log(error + "Didn't grab");
            res.status(500).send();
        });
    });


app.post("/returnSelectedPortfolio", (req, res) => {
    let username = req.body.username;
    let selectedPortfolio = req.body.selectedP;

    pool.query(`SELECT coin, sum(amount), SUM(amount * value)as value FROM portfolio WHERE portfolio = $1 and username = $2 GROUP BY username, portfolio, coin;`, [selectedPortfolio, username])
        .then((result) => {

            console.log("sending selected portfolio " + result.rows);
            res.status(200).send(result.rows);
        })
        .catch((error) => {
            console.log(error + "Didn't send selected portfolios");
            res.status(500).send();
        });
    });

    
app.post("/returnPortfolioTransactions", (req, res) => {
    let username = req.body.username;
    let selectedPortfolio = req.body.selectedP2;

    pool.query(`SELECT coin, amount, (amount * value)as value, date FROM portfolio WHERE portfolio = $1 and username = $2 order by date desc;`, [selectedPortfolio, username])
        .then((result) => {

            console.log("sending selected portfolio transactions " + result.rows);
            res.status(200).send(result.rows);
        })
        .catch((error) => {
            console.log(error + "Didn't send selected portfolios transactions");
            res.status(500).send();
        });
    });

    
app.get("/tablesearch", (req, res) =>{
    if(!(req.query.hasOwnProperty("coin"))){
         res.status(400).json({error: "Invalid origin or destination"});
    }
    else{
        let reqcoin = req.query.coin; 
        axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${reqcoin}`)
        .then((response) => {
        res.status(200).json({data: response.data[0]}); 
         })
         .catch((error) => {
            console.log(error + "Too many API requests, please wait a minute");
            res.status(429).send();
        });
    }
}); 

app.get("/graphsearch", (req, res) =>{
   if(!(req.query.hasOwnProperty("coin"))){
         res.status(400).json({error: "Invalid origin or destination"});
    }
    else{
        let reqcoin = req.query.coin; 
        let reqfrom = req.query.from; 
        let reqto = req.query.to; 
        console.log(req.query); 
        axios.get(`https://api.coingecko.com/api/v3/coins/${reqcoin}/market_chart/range?vs_currency=usd&from=${reqfrom}&to=${reqto}`)
        .then((response) => {
            res.status(200).json({data: response.data}); 
         })
        .catch((error) => {
            console.log(error + "Too many API requests, please wait a minute");
            res.status(429).send();
        });
    }
}); 

app.post("/addToPortfolio", (req, res) => {
    let username = req.body.username;
    let portfolio = req.body.portfolio;
    let coin = req.body.coin;
    let amount = req.body.amount;
    let value = req.body.value;

    pool.query(`INSERT INTO portfolio (username, portfolio, coin, amount, value, date) VALUES ($1, $2, $3, $4, $5, current_timestamp)`, [username, portfolio, coin, amount, value])
        .then(() => {
            console.log(username, "Inserted Successfully into original portfolio");
            res.status(200).send();
        })
        .catch((error) => {
            console.log(error + "Insert failed");
            res.status(500).send();
        });

    //add to additional runningportfolio
    pool.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
        if (result.rows.length != 0) {
            pool.query(`SELECT * FROM runningportfolio WHERE username = $1 and portfolio = $2 and coin = $3`, [username, portfolio, coin])
            .then((result) => {
                if (result.rows.length == 0) {
                    pool.query(`INSERT INTO runningportfolio (username, portfolio, coin, amount) VALUES ($1, $2, $3, $4)`, [username, portfolio, coin, amount])
                    .then(() => {
                        console.log(username, "Inserted Successfully Into runningportfolio");
                        res.status(200).send();
                    })
                    .catch((error) => {
                        console.log(error + "Insert failed");
                        res.status(500).send();
                    });
                }
                else {
                    pool.query(`UPDATE runningportfolio SET amount = (amount + $1) WHERE coin  = $2 and  portfolio = $3`, [amount, coin, portfolio])
                    .then(() => {
                        console.log(username, "Added to existing coin in existing portfolio column in runningportfolio Successfully");
                        res.status(200).send();
                    })
                    .catch((error) => {
                        console.log(error + "Insert failed");
                        res.status(500).send();
                    });
                }
            })      
        }})    
});

app.post("/removeFromPortfolio", (req, res) => {
    let username = req.body.username;
    let portfolio = req.body.portfolio;
    let coin = req.body.coin;
    let amount = req.body.amount;
    let value = req.body.value;

    pool.query(`SELECT SUM(value) FROM portfolio WHERE coin = $1 and username = $2 and portfolio = $3`, [coin, username, portfolio])
    .then((result) => {
        if (result.rows[0].sum >= (value * amount)) {
            pool.query(`INSERT INTO portfolio (username, portfolio, coin, amount, value, date) VALUES ($1, $2, $3, $4, $5, current_timestamp)`, [username, portfolio, coin, amount, value])
            .then(() => {
            console.log(username, "Inserted Negative Successfully into original portfolio");
            res.status(200).send();
            })
            .catch((error) => {
            console.log(error + "Insert failed");
            res.status(500).send();
        });
        }})   

    pool.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
        if (result.rows.length != 0) {
            pool.query(`UPDATE runningportfolio SET amount = (amount - $1) WHERE coin  = $2 and  portfolio = $3`, [amount, coin, portfolio])
                .then(() => {
                    console.log(username, "Removed successfully from runningportfolio");
                    res.status(200).send();
                })
                .catch((error) => {
                    console.log(error + "Remove failed");
                    res.status(500).send();
                });
        }})    
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

app.post("/account", async (req, res) => {
    let loggedInUser = req.cookies.username;
    pool.query(`SELECT SUM(amount * value) FROM portfolio WHERE username = $1`, [loggedInUser]
        ).then((result) => {
            data = result.rows[0].sum;
            zeroData = 0;
            if (data == null) {
                res.send([zeroData]);
            }
            else if (data < 0) {
                res.send([zeroData]);
            }
            else {
                res.status(200);
                res.send(data);
            }
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(error);
            res.send();
        });
});

app.post("/getEthValue", async (req, res) => {
    let loggedInUser = req.cookies.username;
    
    pool.query(`SELECT SUM(amount * value) FROM portfolio WHERE coin = 'ethereum' and username = $1`, [loggedInUser]
    ).then((result) => {
        data = result.rows[0].sum;
        zeroData = 0;
        if (data == null) {
            res.send([zeroData]);
        }
        else if (data < 0) {
            res.send([zeroData]);
        }
        else {
            res.status(200);
            res.send(data);
        }
    })
    .catch((error) => {
        res.sendStatus(500);
        console.log(error);
        res.send();
    });
    });

app.post("/getBitValue", async (req, res) => {
    let loggedInUser = req.cookies.username;
    
    pool.query(`SELECT SUM(amount * value) FROM portfolio WHERE coin = 'bitcoin' and username = $1`, [loggedInUser]
        ).then((result) => {
            data = result.rows[0].sum;
            zeroData = 0;
            if (data == null) {
                res.send([zeroData]);
            }
            else if (data < 0) {
                res.send([zeroData]);
            }
            else {
                res.status(200);
                res.send(data);
            }
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(error);
            res.send();
        });
    });

app.post("/getEosValue", async (req, res) => {
    let loggedInUser = req.cookies.username;
    
    pool.query(`SELECT SUM(amount * value) FROM portfolio WHERE coin = 'eos' and username = $1`, [loggedInUser]
        ).then((result) => {
            data = result.rows[0].sum;
            zeroData = 0;
            if (data == null) {
                res.send([zeroData]);
            }
            else if (data < 0) {
                res.send([zeroData]);
            }
            else {
                res.status(200);
                res.send(data);
            }
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(error);
            res.send();
        });
    });

app.post("/getRippleValue", async (req, res) => {
    let loggedInUser = req.cookies.username;
    
    pool.query(`SELECT SUM(amount * value) FROM portfolio WHERE coin = 'ripple' and username = $1`, [loggedInUser]
        ).then((result) => {
            data = result.rows[0].sum;
            zeroData = 0;
            if (data == null) {
                res.send([zeroData]);
            }
            else if (data < 0) {
                res.send([zeroData]);
            }
            else {
                res.status(200);
                res.send(data);
            }
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(error);
            res.send();
        });
});

app.post("/getLiveAccountBalance", (req, res) => {
    let loggedInUser = req.cookies.username;
    pool.query(`SELECT coin, SUM(amount) as amount FROM runningportfolio WHERE username = $1 GROUP BY coin`, [loggedInUser]
    ).then((result) => {

        data = result.rows;
        zeroData = 0;
        if (data == null) {
            res.send([zeroData]);
        }
        else if (data < 0) {
            res.send([zeroData]);
        }
        else {
            res.status(200);
            console.log(data);
            res.send(data);
        }
    })
    .catch((error) => {
        res.sendStatus(500);
        console.log(error);
        res.send();
    });
})


app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});