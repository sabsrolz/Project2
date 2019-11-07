var db = require("../models");
const axios = require("axios");
const moment = require("moment");

module.exports = function(app) {
  //GET Route that will display current price of stock to user
  app.get("/api/stock", function(req, res) {
    //let portfolio_sabs = [];
    let ticker;
    let num_shares;
    let total_price = 0;
    let currentTime = moment()
      .add(1, "hours")
      .subtract(1, "minutes")
      .format("YYYY-MM-DD HH:mm:00");
    console.log(currentTime);
    function searchTicker(company) {
      const api_key = "8HGF9L0ALM5LPNX5"; //send to env
      const query_ticker = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${company}&apikey=${api_key}`;
      axios.get(query_ticker).then(function(response) {
        ticker = response["bestMatches"][0]["1. symbol"];
        const queryURLIntraday = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=8HGF9L0ALM5LPNX5`;
        axios.get(queryURLIntraday).then(function(response) {
          close_minutely =
            response["Time Series (1min)"][currentTime]["4. close"];
          total_price = num_shares * close_minutely;
          console.log(total_price);
        });
        const transaction_object = {
          companyName: company,
          ticker: ticker,
          currentStockPrice: close_minutely
        };
        res.json(transaction_object);
      });
    }
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
    transTotal = numShares * currentPrice;
    let transaction;
    let updatedFunds;
    db.user
      .findAll({
        where: {
          user: userId
        }
      })
      .then(function(result, err) {
        if (err) throw err;
        // res.json(result);
        // console.log(result);
        const currentFunds = result.fundsAvailable;
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
            console.log("you dont have enough funds to complete transaction");
          }
        } else {
          db.transactions_table
            .findAndCountAll({
              include: [{ ticker: ticker }],
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
      });
  });

  //put calls
  function updateUser(x) {
    app.put("/api/transaction/:user", function(req, res) {
      db.user
        .updateOne({ fundsAvailable: x }, { userId: req.params.user })
        .then(function(data, err) {
          if (err) throw err;
          console.log(data);
          res.json(data);
        });
    });
  }
};
