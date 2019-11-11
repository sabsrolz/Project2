var db = require("../models");
const axios = require("axios");
const moment = require("moment");
console.log("api routes connected");

module.exports = function(app) {
  //GET Route that will display current price of stock to user
  app.get("/api/stock/:company", function(req, res) {
    let company = req.params.company;
    let ticker;

    let total_price;
    // let currentTime = moment()
    //   .add(1, "hours")
    //   .subtract(1, "minutes")
    //   .format("YYYY-MM-DD HH:mm:00");
    // console.log(currentTime);
    //console.log(company);
    const api_key = "8HGF9L0ALM5LPNX5"; //send to env
    const query_ticker = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${company}&apikey=${api_key}`;
    axios
      .get(query_ticker)
      .then(function(response) {
        //console.log(response.data["bestMatches"][0]["1. symbol"]);
        ticker = response.data["bestMatches"][0]["1. symbol"];
        const queryURLIntraday = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=8HGF9L0ALM5LPNX5`;
        axios
          .get(queryURLIntraday)
          .then(function(response) {
            //console.log(response["Time Series (1min)"]);
            const timeSeries = response.data["Time Series (1min)"];
            close_minutely = Object.values(timeSeries)[0]["4. close"];
            //console.log(close_minutely);

            const transaction_object = {
              companyName: company,
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

  //POST ROUTE when user purchases/sells # of shares at $ price
  app.post("/api/transaction/:user", function(req, res) {
    //req.body = {numShares, buy/sell}
    const numShares = req.body.numShares;
    const transactionType = req.body.transactionType;
    const companyName = req.body.companyName;
    const userId = req.params.user;
    let userPortfolio = req.body.userPortfolio;
    // const dummyportfolio = {
    //   userid: 0,
    //   stocks: { stock1: 6, stock2: 5, stock3: 5 }
    // };
    //console.log(companyName);
    const api_key = "8HGF9L0ALM5LPNX5"; //send to env
    const query_ticker = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${companyName}&apikey=${api_key}`;
    axios.get(query_ticker).then(function(response) {
      //console.log(response.data["bestMatches"][0]["1. symbol"]);
      let ticker = response.data["bestMatches"][0]["1. symbol"];
      const queryURLIntraday = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=8HGF9L0ALM5LPNX5`;
      axios.get(queryURLIntraday).then(function(response) {
        //console.log(response["Time Series (1min)"]);
        const timeSeries = response.data["Time Series (1min)"];
        close_minutely = Object.values(timeSeries)[0]["4. close"];
        console.log(close_minutely);
        transTotal = numShares * close_minutely;
        let transaction;
        let updatedFunds;
        db.User.findAll({
          where: {
            userId: userId
          }
        })
          .then(function(result, err) {
            if (err) throw err;
            console.log(result);
            const currentFunds = parseFloat(
              result[0].dataValues.fundsAvailable
            );

            console.log(currentFunds);
            console.log(transTotal);
            // console.log(currentFunds);
            // console.log(typeof currentFunds);
            if (transactionType === "buy") {
              if (currentFunds >= transTotal) {
                updatedFunds = currentFunds - transTotal;
                updateUser(updatedFunds, userId);
                transaction = {
                  companyName: companyName,
                  ticker: ticker,
                  userId: userId,
                  sharesTraded: numShares,
                  transactionPrice: transTotal
                };
                db.Transactions.create(transaction).then(function(err, result) {
                  if (err) throw err;
                  console.log(result);
                  res.send("transaction was successfully recorded");
                });
              } else {
                res.send("you dont have enough funds to complete transaction");
              }
            } else {
              const count = userPortfolio.stocks[ticker];
              console.log(count);
              // db.Transactions.findAndCountAll({
              //   include: [{ ticker: ticker }],
              //   where: {
              //     userId: userId
              //   }
              // })
              //   .then(function(err, result) {
              //     if (err) throw err;
              //     console.log(result);
              if (numShares <= count) {
                updatedFunds = currentFunds + transTotal;
                console.log(updatedFunds);
                transaction = {
                  companyName: companyName,
                  ticker: ticker,
                  userId: userId,
                  sharesTraded: numShares,
                  transactionPrice: transTotal
                };
                updateUser(updatedFunds, userId);
                db.Transactions.create(transaction)
                  .then(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    res.send("transaction was successfully recorded");
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } else {
                res.send("Insufficient shares to complete transaction");
              }
              // })
              // .catch(err => {
              //   console.log(err);
              // });
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
  });
  app.put(`/api/transaction/:user`, function(req, res) {
    console.log(x);
  });

  //put calls
  function updateUser(x, user) {
    console.log(db.User);
    db.User.updateOne({ fundsAvailable: x }, { userId: user }).then(function(
      data,
      err
    ) {
      if (err) throw err;
      console.log(data);
      res.json(data);
    });
  }
};

//hn_YvbyFGxzX8BoATAmf
//0ebb6649b6ff470299dc8fa3faed3116 (news)
//https://newsapi.org/v2/top-headlines?q=microsoft&apiKey=0ebb6649b6ff470299dc8fa3faed3116

//standard deviation - volatility
//1, 3, 5, 10 yrs
//sharpe ratio
//max drawdown
