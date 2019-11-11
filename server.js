require("dotenv").config();
const express = require("express");
// const exphbs = require("express-handlebars");

const db = require("./models");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(express.static("public"));

// // Handlebars <- not using handlebars
// app.engine(
//   "handlebars",
//   exphbs({
//     defaultLayout: "main"
//   })
// );
// app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = {
  force: false
};

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;

// Socket IO connection
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
users = [];
connections = [];

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/leaderboard.html");
});
io.sockets.on("connection", function (socket) {
  connections.push("connecter: %s sockets connecterd", connections.lenght);

  //disconect
  socket.on('disconnect', function (data) {
    connections.splice(connections.indexof(socket), 1);
    console.log("disconnected %s sockets connected", connections.lenght);
  })
  socket.on('send message', function (data) {
    console.log(data)
    io.sockets.emit('new message', {
      msg: data
    })
  })
});

module.exports = io