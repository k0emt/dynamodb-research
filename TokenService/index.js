const express = require("express");
const https = require("https");
const fs = require("fs");

const PORT = 8000;
const VERSION = 1.0;

const app = express();

app.get("/", function (req, res) {
  response = { serviceName: "token service", version: VERSION };

  res.send(JSON.stringify(response));
});

app.get("/echo/:message", function (req, res) {
  response = { echo: req.params.message };

  res.send(JSON.stringify(response));
});

const options = {
  key: fs.readFileSync("Cert/token-service-key.pem"),
  cert: fs.readFileSync("Cert/token-service-cert.pem"),
};

var server = https.createServer(options, app);
server.listen(PORT, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Token Server listening at http://%s:%s", host, port);
});
