'use strict';

var http = require('http');
var finalhandler = require('finalhandler');
var createRouter = require('./router');

function createServer(resolvePath) {
  var router = createRouter(resolvePath);
  var server = http.createServer();

  server.on('request', function (req, res) {
    router(req, res, finalhandler(req, res, { onerror: function (err) {
      console.error(err.stack || err.message || err);
    }}));
  });

  return server;
}

module.exports = createServer;
