'use strict';

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var ecstatic = require('ecstatic');
var Router = require('router');
var EventSource = require('faye-websocket').EventSource;
var createBus = require('./bus');
var createLoader = require('./loader');
var WWW_ROOT = path.resolve(__dirname, '..', 'www');
var VENDOR_ROOT = path.resolve(__dirname, '..', 'vendor');

function createRouter(resolvePath) {
  var loadContent = createLoader(resolvePath);
  var router = new Router();
  var buses = {};

  router.use(function (req, res, next) {
    if (req.url.slice(-1) === '/') {
      res.writeHead(302, {
        'Location': req.url.slice(0, -1)
      });
    };

    next();
  });

  router.use('/www', ecstatic({ root: WWW_ROOT }));
  router.use('/vendor', ecstatic({ root: VENDOR_ROOT }));

  router.get('/', function (req, res, next) {
    res.end('Dashboard goes here.');
  });

  router.get('/:script', function (req, res, next) {
    loadContent(req.params.script)
      .then(function (content) {
        var header = fs.createReadStream(path.join(WWW_ROOT, 'view.html'));

        header.pipe(res, { end: false });
        header.on('end', function () {
          content.pipe(res);
        });
      })
      .catch(next);
  });

  router.get('/:script/control', function (req, res, next) {
    fs.createReadStream(path.join(WWW_ROOT, 'control.html'))
      .pipe(res);
  });

  router.get('/:script/events', function (req, res, next) {
    if (!EventSource.isEventSource(req)) {
      res.writeHead(400);
      res.end();
      return;
    }

    var source = new EventSource(req, res);
    var bus = buses[req.params.script] || (buses[req.params.script] = createBus());

    function onEvent(event) {
      source.send(JSON.stringify(event), { event: event.type });
    }

    bus.addListener(onEvent);

    source.on('close', function () {
      bus.removeListener(onEvent);
    });
  });

  router.post('/:script/events', bodyParser.json(), function (req, res, next) {
    var bus = buses[req.params.script] || (buses[req.params.script] = createBus());

    bus.emit(req.body.type, req.body);

    res.end();
  });

  return router;
}

module.exports = createRouter;
