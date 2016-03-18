'use strict';

var path = require('path');
var stream = require('stream');
var Promise = require('bluebird');
var loadStreamBody = require('raw-body');
var tape = require('tape');
var createResolver = require('../lib/resolver');

tape.test('Resolver', function (suite) {
  var resolver = createResolver(path.resolve(__dirname, 'fixture/loader'));

  suite.test('constructor defaults to cwd', function (t) {
    var subject = createResolver();

    t.equal(subject.dirname, process.cwd());

    t.end();
  });

  suite.test('constructor accepts relative path', function (t) {
    var subject = createResolver('relative');

    t.equal(subject.dirname, path.join(process.cwd(), 'relative'));

    t.end();
  });

  suite.test('constructor accepts absolute path', function (t) {
    var subject = createResolver('/absolute');

    t.equal(subject.dirname, '/absolute');

    t.end();
  });

  suite.test('constructor returns resolver function', function (t) {
    var subject = createResolver();

    t.ok(typeof subject === 'function');

    t.end();
  });

  suite.test('resolver returns a Promise', function (t) {
    var subject = resolver('test');

    t.ok(subject instanceof Promise);

    t.end();
    subject.catch(function noop() {});
  });

  suite.test('resolver rejects bogus name', function (t) {
    resolver('obviously-does-not-exist')
      .then(function () {
        t.end(new Error('Should have failed.'));
      }, function (err) {
        t.ok(err);

        t.end();
      });
  });

  suite.test('resolver fails without name if dirname does not exist', function (t) {
    createResolver('bogus-path')()
      .then(function () {
        t.end(new Error('Should have failed.'));
      }, function (err) {
        t.equal(err.code, 'ENOENT');

        t.end();
      });
  });

  suite.test('resolver fails with name if dirname does not exist', function (t) {
    createResolver('bogus-path')('bogus-name')
      .then(function () {
        t.end(new Error('Should have failed.'));
      }, function (err) {
        t.equal(err.code, 'ENOENT');

        t.end();
      });
  });

  suite.test('resolver resolves html', function (t) {
    resolver('html-only')
      .then(function (subject) {
        t.equal(subject, path.join(resolver.dirname, 'html-only.html'));
      })
      .then(t.end, t.end);
  });

  suite.test('resolver resolves md', function (t) {
    resolver('md-only')
      .then(function (subject) {
        t.equal(subject, path.join(resolver.dirname, 'md-only.md'));
      })
      .then(t.end, t.end);
  });

  suite.test('resolver resolves markdown', function (t) {
    resolver('markdown-only')
      .then(function (subject) {
        t.equal(subject, path.join(resolver.dirname, 'markdown-only.markdown'));
      })
      .then(t.end, t.end);
  });

  suite.test('resolver resolves txt', function (t) {
    resolver('txt-only')
      .then(function (subject) {
        t.equal(subject, path.join(resolver.dirname, 'txt-only.txt'));
      })
      .then(t.end, t.end);
  });

  suite.test('resolver prefers html', function (t) {
    resolver('priority-html')
      .then(function (subject) {
        t.equal(subject, path.join(resolver.dirname, 'priority-html.html'));
      })
      .then(t.end, t.end);
  });

  suite.test('resolver prefers md', function (t) {
    resolver('priority-md')
      .then(function (subject) {
        t.equal(subject, path.join(resolver.dirname, 'priority-md.md'));
      })
      .then(t.end, t.end);
  });

  suite.test('resolver prefers markdown', function (t) {
    resolver('priority-markdown')
      .then(function (subject) {
        t.equal(subject, path.join(resolver.dirname, 'priority-markdown.markdown'));
      })
      .then(t.end, t.end);
  });

  suite.test('resolver returns dirname without name', function (t) {
    resolver()
      .then(function (subject) {
        t.equal(subject, resolver.dirname);

        t.end();
      });
  });
});
