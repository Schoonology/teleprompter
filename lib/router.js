'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var bodyParser = require('body-parser');
var Router = require('router');
var VIEW_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'data', 'view.html'), 'utf8');
var CONTROL_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'data', 'control.html'), 'utf8');

function createRouter(content) {
  var router = Router();
  var viewContent = util.format(VIEW_TEMPLATE, content);
  var controlContent = util.format(CONTROL_TEMPLATE, content);
  var settings = {};

  router.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end(viewContent);
  });

  router.get('/control', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end(controlContent);
  });

  router.use('/settings', bodyParser.json());

  router.post('/settings', function (req, res) {
    settings = req.body;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(settings));
  });

  router.get('/settings', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(settings));
  });

  return router;
}

module.exports = createRouter;
