'use strict';

var http = require('http');
var finalhandler = require('finalhandler');
var createRouter = require('./router');

function createServer(content) {
  var router = createRouter(content);
  var server = http.createServer();

  server.on('request', function (req, res) {
    router(req, res, finalhandler(req, res));
  });

  return server;
}

module.exports = createServer;
