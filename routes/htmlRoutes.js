const db = require("../models");
const path = require("path");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.sendFile(path.join(`${__dirname}../public/index.html`));
  });

  app.get("/search", function(req, res) {
    res.sendFile(path.join(`${__dirname}../public/search.html`));
  });

  app.get("/top", function(req, res) {
    res.sendFile(path.join(`${__dirname}../public/leaderboard.html`));
  });

  //   // Render 404 page for any unmatched routes
  //   app.get("*", function(req, res) {
  //     res.render("404");
  //   });
};
