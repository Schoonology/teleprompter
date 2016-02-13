'use strict';

var http = require('http');
var tape = require('tape');
// var td = require('testdouble');
var createServer = require('../lib/server');

tape.test('Server', function (suite) {
  suite.test('constructor returns an http.Server', function (t) {
    var subject = createServer();

    t.ok(subject instanceof http.Server);

    t.end();
  });

  // suite.test('constructor returns the http.Server', function (t) {
  //   var FAKE_SERVER = { foo: 'bar' };
  //   var subject;
  //
  //   http.createServer = td.function();
  //
  //   td.when(http.createServer()).thenReturn(FAKE_SERVER);
  //   subject = createServer();
  //
  //   console.log(FAKE_SERVER);
  //
  //   t.equal(subject, FAKE_SERVER);
  //
  //   t.end();
  // });

  suite.test('GET /{script} calls loadContent(script)');
});
