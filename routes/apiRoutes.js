var db = require("../models");
const axios = require("axios");
// const moment = require("moment");
console.log("api routes connected");

module.exports = function(app) {
  //GET Route that will display current price of stock to user
  app.get("/api/stock/:company", function(req, res) {
    let company = req.params.company;
    let ticker;
    // let num_shares = 5;
    let total_price;
    // let currentTime = moment()
    //   .add(1, "hours")
    //   .subtract(1, "minutes")
    //   .format("YYYY-MM-DD HH:mm:00");
    // console.log(currentTime);
    //console.log(company);
    const api_key = "L9NQIQI6RSM70ZCL"; //send to env
    const query_ticker = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${company}&apikey=${api_key}`;
    axios.get(query_ticker).then(function(response) {
      // this should be client side:
      // $("#stockInfoName").text("Name: " + ticker);
      //console.log(response.data["bestMatches"][0]["1. symbol"]);
      ticker = response.data["bestMatches"][0]["1. symbol"];
      const queryURLIntraday = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=8HGF9L0ALM5LPNX5`;
      axios.get(queryURLIntraday).then(function(response) {
        // console.log(response.data["Time Series (1min)"]);
        const timeSeries = response.data["Time Series (1min)"];
        close_minutely = Object.values(timeSeries)[0]["4. close"];
        //console.log(close_minutely);

        // Sean : "I didn't realize it was multiplying by 5 woops"
        // total_price = num_shares * parseFloat(close_minutely);
        // console.log(total_price);

        const transaction_object = {
          companyName: company,
          ticker: ticker,
          currentStockPrice: close_minutely
        };

        res.json(transaction_object);
      });
    });
  });

  app.get("/api/test", function(req, res) {
    res.send("ok");
  });
  //POST ROUTE when user purchases/sells # of shares at $ price
  app.post("/api/transaction/:user", function(req, res) {
    //req.body = {numShares, buy/sell}
    const numShares = req.body.numShares;
    const transactionType = req.body.transactionType;
    const currentPrice = req.body.currentPrice;
    const companyName = req.body.companyName;
    const ticker = req.body.ticker;
    const userId = req.params.user;
    const transTotal = numShares * currentPrice;
    const currentFunds = req.body.fundsAvailable;
    let transaction;
    let updatedFunds;
    // db.User.findAll({
    //   where: {
    //     id: userId
    //   }
    // }).then(function(result, err) {
    //   if (err) throw err;
    // res.json(result);
    // console.log(result);
    console.log(currentFunds);
    if (transactionType === "buy") {
      if (currentFunds >= transTotal) {
        updatedFunds = currentFunds - transTotal;
        updateUser(updatedFunds);
        transaction = {
          companyName: companyName,
          ticker: ticker,
          userId: userId,
          sharesTraded: numShares,
          transactionPrice: transTotal
        };
        db.Transactions.create({
          transaction
        }).then(function(err, result) {
          if (err) throw err;
          console.log(result);
          console.log("transaction was successfully recorded");
        });
      } else {
        console.log("you dont have enough funds to complete transaction");
      }
    } else {
      db.transactions
        .findAndCountAll({
          include: [
            {
              ticker: ticker
            }
          ],
          where: {
            userId: userId
          }
        })
        .then(function(err, result) {
          if (err) throw err;
          console.log(result);
          if (numShares >= result.count) {
            updatedFunds = currentFunds + transTotal;
            transaction = {
              companyName: companyName,
              ticker: ticker,
              userId: userId,
              sharesTraded: numShares,
              transactionPrice: transTotal
            };
            updatedFunds(updatedFunds);
            db.transactions
              .create({
                transaction
              })
              .then(function(err, result) {
                if (err) throw err;
                console.log(result);
                console.log("transaction was successfully recorded");
              });
          } else {
            console.log("Insufficient shares to complete transaction");
          }
        });
    }
    // });
  });

  //put calls
  function updateUser(x) {
    app.put("/api/transaction/:user", function(req, res) {
      db.user
        .updateOne(
          {
            fundsAvailable: x
          },
          {
            userId: req.params.user
          }
        )
        .then(function(data, err) {
          if (err) throw err;
          console.log(data);
          res.json(data);
        });
    });
  }

  // creating a new user:
  app.post("/api/user", function(req, res) {
    // req.body = {all user data except id and money}
    // console.log(req.body);
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      fundsAvailable: 1000
    };
    db.User.create(newUser).then(function(err, result) {
      // if (err) throw err;
      console.log(result);
      console.log(err);
      console.log("new user created");
    });
  });

  // get all users
  // app.get("/api/allUsers", function(req, res) {
  //   db.Users.findAll().then(function() {
  //     // if (err) throw err;
  //   });
  // });

  // getting user by email and password:
  app.post("/api/user/loginid", function(req, res) {
    const loginEmail = req.body.loginEmail;
    const loginPassword = req.body.loginPassword;
    db.User.findOne({
      where: { email: loginEmail, password: loginPassword }
    }).then(function(result, err) {
      if (err) throw err;
      res.json(result);
    });
  });

  // get user by id, after login:
  app.post("/api/user/idcheck", function(req, res) {
    db.User.findOne({
      where: { id: req.body.userId }
    }).then(function(result, err) {
      if (err) throw err;
      res.json(result);
    });
  });
};

//hn_YvbyFGxzX8BoATAmf
//0ebb6649b6ff470299dc8fa3faed3116 (news)
//https://newsapi.org/v2/top-headlines?q=microsoft&apiKey=0ebb6649b6ff470299dc8fa3faed3116

//standard deviation - volatility
//1, 3, 5, 10 yrs
//sharpe ratio
//max drawdown
