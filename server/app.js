let express = require("express");
let cors = require("cors");
require("dotenv").config();

// Create global app object
let app = express();

app.use(cors(
  {
    origin:"https://influocial-client.herokuapp.com",
    credentials:true
  }
));
var allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:4100",
  "http://localhost:4300",
  "http://localhost:3000",
  "http://178.62.48.128",
  "https://localhost:4200",
  "https://localhost:4100",
  "https://localhost:4300",
  "https://localhost:3000",
  "https://178.62.48.128",
  "https://influocial-client.herokuapp.com"
];



app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', 'https://influocial-client.herokuapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

require("./app-config")(app);



// const http = require('http').Server(app);

// finally, let's start our server...
let server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + server.address().port);
});
global.InfluocialSocket = require("socket.io")(server, {
  // cors: {
  //   credentials: true,
  //   origin: function (origin, callback) {
  //     // allow requests with no origin
  //     // (like mobile apps or curl requests)
  //     if (!origin) return callback(null, true);
  //     if (allowedOrigins.indexOf(origin) === -1) {
  //       var msg =
  //         "The CORS policy for this site does not " +
  //         "allow access from the specified Origin.";
  //       return callback(new Error(msg), false);
  //     }
  //     return callback(null, true);
  //   },
  // },
  cors:{
    origin:"*"
  }
});

InfluocialSocket.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
