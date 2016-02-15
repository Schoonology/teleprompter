'use strict';

var path = require('path');
var fork = require('child_process').fork;
var tape = require('tape');

process.chdir(path.resolve(__dirname, '..'));

tape.test('Teleprompter', function (suite) {
  suite.test('fails with no argument', function (t) {
    var child = fork('bin/teleprompter', {
      silent: true
    });

    child.on('exit', function (code) {
      t.notEqual(code, 0);

      t.end();
    });
  });

  suite.test('fails with bogus argument', function (t) {
    var child = fork('bin/teleprompter', ['obviously-does-not-exist'], {
      silent: true
    });

    child.on('exit', function (code) {
      t.notEqual(code, 0);

      t.end();
    });
  });

  suite.test('fails with file argument', function (t) {
    var child = fork('bin/teleprompter', ['test/index.js'], {
      silent: true
    });

    child.on('exit', function (code) {
      t.notEqual(code, 0);

      t.end();
    });
  });
});
