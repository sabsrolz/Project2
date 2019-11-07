var db = require("../models");
const axios = require("axios");
const moment = require("moment");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    //let portfolio_sabs = [];
    let ticker;
    let num_shares = 5;
    let total_price = 0;
    let currentTime = moment().format("YYYY-MM-DD hh:mm:ss");
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
        //portfolio_sabs = `${company},${ticker},${num_shares}`;
      });
    }

    const queryURLDaily =
      "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=8HGF9L0ALM5LPNX5";
    const query_quote =
      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=8HGF9L0ALM5LPNX5";

    searchTicker("Apple");
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};
