'use strict';

var path = require('path');
var Promise = require('bluebird');
var tape = require('tape');
var createLoadDirectory = require('../lib/load-directory');
var createResolver = require('../lib/resolve-path');

tape.test('loadDirectory', function (suite) {
  var resolvePath = createResolver(path.resolve(__dirname, 'fixture/loader'));
  var loadDirectory = createLoadDirectory(resolvePath);

  suite.test('constructor requires a function', function (t) {
    t.plan(1);

    try {
      createLoadDirectory();
    } catch (err) {
      t.equal(err.name, 'TypeError');
    }

    t.end();
  });

  suite.test('constructor returns loadDirectory function', function (t) {
    var subject = createLoadDirectory(resolvePath);

    t.ok(typeof subject === 'function');

    t.end();
  });

  suite.test('loadDirectory returns a Promise', function (t) {
    var subject = loadDirectory('test');

    t.ok(subject instanceof Promise);

    t.end();
    subject.catch(function noop() {});
  });

  suite.test('loadDirectory returns directory listing', function (t) {
    loadDirectory()
      .then(function (subject) {
        t.notEqual(subject.indexOf('html-only'), -1);
        t.equal(subject.indexOf('bogus-name'), -1);
      })
      .then(t.end, t.end);
  });

  suite.test('loadDirectory removes duplicates', function (t) {
    loadDirectory()
      .then(function (subject) {
        t.notEqual(subject.indexOf('priority-html'), -1);

        subject.splice(subject.indexOf('priority-html'), 1);

        t.equal(subject.indexOf('priority-html'), -1);
      })
      .then(t.end, t.end);
  });
});
