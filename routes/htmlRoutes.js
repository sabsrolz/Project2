// const db = require("../models");
const path = require("path");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.sendFile(path.join(`${__dirname}/../public/index.html`));
  });

  app.get("/search", function(req, res) {
    res.sendFile(path.join(`${__dirname}/../public/search.html`));
  });

  app.get("/top", function(req, res) {
    res.sendFile(path.join(`${__dirname}/../public/leaderboard.html`));
  });

  app.get("/profiles", function(req, res) {
    res.sendFile(path.join(`${__dirname}/../public/profile.html`));
  });

  app.get("/signup", function(req, res) {
    res.sendFile(path.join(`${__dirname}/../public/signup.html`));
  });

  app.get("/login", function(req, res) {
    res.sendFile(path.join(`${__dirname}/../public/signin.html`));
  });

  // Render 404 page for any unmatched routes
  // app.get("*", function(req, res) {
  //   res.json(404);
  // });
};
