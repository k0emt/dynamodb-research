const express = require("express");
const https = require("https");
const fs = require("fs");

const bite = require("./bite");
const config = require("./config");

const app = express();

app.get("/", bite.version);
app.get("/echo/:message", bite.echo);

const options = {
  key: fs.readFileSync("Cert/token-service-key.pem"),
  cert: fs.readFileSync("Cert/token-service-cert.pem"),
};

var server = https.createServer(options, app);
server.listen(config.PORT, () => {
  var host = "localhost"; // server.address().address;
  var port = server.address().port;
  console.log("Token Server listening at http://%s:%s", host, port);
});
