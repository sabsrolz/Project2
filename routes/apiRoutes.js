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
    // let total_price;
    // let currentTime = moment()
    //   .add(1, "hours")
    //   .subtract(1, "minutes")
    //   .format("YYYY-MM-DD HH:mm:00");
    // console.log(currentTime);
    //console.log(company);
    const api_key = process.env; //send to env
    const query_ticker = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${company}&apikey=${api_key}`;
    axios
      .get(query_ticker)
      .then(function(response) {
        // this should be client side:
        // $("#stockInfoName").text("Name: " + ticker);
        //console.log(response.data["bestMatches"][0]["1. symbol"]);
        ticker = response.data["bestMatches"][0]["1. symbol"];
        const company_name = response.data["bestMatches"][0]["2. name"];
        const queryURLIntraday = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=8HGF9L0ALM5LPNX5`;
        axios
          .get(queryURLIntraday)
          .then(function(response) {
            // console.log(response.data["Time Series (1min)"]);
            const timeSeries = response.data["Time Series (1min)"];
            close_minutely = Object.values(timeSeries)[0]["4. close"];
            console.log(close_minutely);

            // Sean : "I didn't realize it was multiplying by 5 woops"
            // total_price = num_shares * parseFloat(close_minutely);
            // console.log(total_price);

            const transaction_object = {
              companyName: company_name,
              ticker: ticker,
              currentStockPrice: close_minutely
            };

            res.json(transaction_object);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  });
  //get route to retrieve count of stocks that a user has (for sell)
  app.get("/api/portfolio/:user", function(req, res) {
    console.log("route hit");
    const userId = req.params.user;
    const userPortfolio = { userId: userId };
    const stocks = {};
    // "userPortfolio": {"userId": 1,
    // "stocks": {"MORN":2, "FIT":10}}
    db.Transactions.findAll({
      where: {
        userId: userId.toString()
      }
    }).then(function(result, err) {
      //console.log(result);
      for (const key in result) {
        const element = result[key];
        const trans_ticker = element.dataValues.ticker;
        const sharesTraded = element.dataValues.sharesTraded;
        if (trans_ticker in stocks) {
          stocks[trans_ticker] = stocks[trans_ticker] + sharesTraded;
        } else {
          stocks[trans_ticker] = sharesTraded;
        }
      }
      userPortfolio.stocks = stocks;
      res.json(userPortfolio);
    });
  });
  //POST ROUTE when user purchases/sells # of shares at $ price
  app.post("/api/transaction/:user", function(req, res) {
    // put calls
    function updateUser(newfunds, targetUserId) {
      // console.log("updating funds...");
      // console.log(newfunds);
      // console.log(typeof targetUserId);
      // app.put("/api/transaction/", function(req, res) { // THIS DOES NOT ACTUALLY RUN A QUERY <-----
      db.User.update(
        {
          fundsAvailable: newfunds
        },
        {
          where: {
            id: parseInt(targetUserId)
          }
        }
      ).then(function(data, err) {
        if (err) console.log("error" + err);
        // console.log("updated fundsAvailable");
        // console.log(data);
        // if (data) console.log(data);
        // res.json(data);
      });
      // });
    }
    //req.body = all of this stuff here ------

    const numShares = req.body.numShares;
    const transactionType = req.body.transactionType;
    const companyName = req.body.companyName;
    const ticker = req.body.ticker;
    const currentPrice = req.body.currentPrice;
    // -----------------

    const userId = req.params.user;
    const transTotal = numShares * currentPrice;
    const currentFunds = req.body.fundsAvailable;

    let transaction;
    let updatedFunds;

    // this is already available, don't query
    // db.User.findAll({
    //   where: {
    //     id: userId
    //   }
    // }).then(function(result, err) {
    //   if (err) throw err;
    // res.json(result);
    // console.log(result);
    // console.log(currentFunds);

    if (transactionType === "buy") {
      if (currentFunds >= transTotal) {
        updatedFunds = currentFunds - transTotal;
        transaction = {
          companyName: companyName,
          ticker: ticker,
          userId: userId,
          sharesTraded: numShares,
          transactionPrice: transTotal
        };

        db.Transactions.create(transaction).then(function(result, err) {
          updateUser(updatedFunds, userId);
          if (err) throw err;
          // console.log("RESULT: " + result);
          console.log("transaction was successfully recorded");
        });
      } else {
        console.log("you dont have enough funds to complete transaction");
      }
    } else if (transactionType === "sell") {
      // $.get(`api/portfolio/${sessionStorage.get("stockAppUser")}`, function(
      //   data
      // ) {
      //   console.log(data);
      // });
      const userPortfolio = { userId: userId };
      const stocks = {};
      // "userPortfolio": {"userId": 1,
      // "stocks": {"MORN":2, "FIT":10}}
      db.Transactions.findAll({
        where: {
          userId: userId.toString()
        }
      }).then(function(result, err) {
        //console.log(result);
        for (const key in result) {
          const element = result[key];
          const trans_ticker = element.dataValues.ticker;
          const sharesTraded = element.dataValues.sharesTraded;
          if (trans_ticker in stocks) {
            stocks[trans_ticker] = stocks[trans_ticker] + sharesTraded;
          } else {
            stocks[trans_ticker] = sharesTraded;
          }
        }
        userPortfolio.stocks = stocks;

        const count = userPortfolio.stocks[ticker];

        if (parseInt(numShares) <= count) {
          updatedFunds = currentFunds + transTotal;
          transaction = {
            companyName: companyName,
            ticker: ticker,
            userId: userId,
            sharesTraded: 0 - numShares,
            transactionPrice: transTotal
          };
          updateUser(updatedFunds); // corrected from updatedFunds(updatedFunds)
          db.Transactions.create(transaction).then(function(result, err) {
            if (err) throw err;
            // console.log(result);
            console.log("transaction was successfully recorded");
          });
        } else {
          console.log("Insufficient shares to complete transaction");
        }
      });
    }
    // });
  });

  // }

  // get all users, fundsavailable and networth(funds+portfolio)
  // my head hurts

  app.get("/api/allUsers", function(req, res) {
    const usersArray = [];
    db.User.findAll()
      .then(function(result, err) {
        for (const user in result) {
          const userObject = {
            id: result[user].id.toString(),
            funds: result[user].fundsAvailable,
            portfolio: [],
            netWorth: result[user].fundsAvailable
          };
          usersArray.push(userObject);
        }
      })

      // NOTE : cascading .thens are causing problems

      // .then(function() {
      //   usersArray.forEach(object => {
      //     db.Transactions.findAll({
      //       where: {
      //         userId: object.id
      //       }
      //     })
      // .then(function(data) {
      //   if (data[0]) {
      //     for (const key in data[0].dataValues) {
      //       object.portfolio.push(data[0].dataValues[key]);
      //     }
      //   }
      //   // data.forEach(element => {
      //   // console.log(element[0]);
      //   // object.portfolio.push(element[0]);
      //   // });
      // })
      // });
      .then(function() {
        res.json(usersArray);
      });
    // console.log(usersArray);
    // });
  });

  app.post("/api/allTransactions", function(req, res) {
    console.log("req.body.id: " + req.body.id);
    db.Transactions.findAll({ where: { userId: req.body.id.toString() } }).then(
      function(result, err) {
        res.json(result);
      }
    );
  });

  // get user by email and password:
  app.post("/api/user/loginid", function(req, res) {
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;
    db.User.findOne({
      where: { email: loginEmail, password: loginPassword }
    }).then(function(result, err) {
      // console.log(result);
      res.json(result);
    });
  });

  // get user by first name
  app.post("/api/user/namecheck", function(req, res) {
    console.log(req.body);
    db.User.findOne({
      where: { firstName: req.body.name }
    }).then(function(result, err) {
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
    db.User.create(newUser).then(function(result, err) {
      if (err) throw err;
      console.log("new user created");
      db.User.findOne({
        where: { email: newUser.email, password: newUser.password }
      }).then(function(result, err) {
        if (err) throw err;

        res.json(result);
      });
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
