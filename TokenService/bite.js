const { application } = require("express");

const config = require("./config");

exports.echo = (req, res) => {
  response = { echo: req.params.message };

  res.send(JSON.stringify(response));
};

exports.version = (req, res) => {
  response = { serviceName: "token service", version: config.VERSION };

  res.send(JSON.stringify(response));
}