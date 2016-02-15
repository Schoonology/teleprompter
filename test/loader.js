'use strict';

var path = require('path');
var stream = require('stream');
var tape = require('tape');
var createLoader = require('../lib/loader');

tape.test('Loader', function (suite) {
  var loader = createLoader(path.resolve(__dirname, 'fixture/loader'));

  suite.test('constructor defaults to cwd', function (t) {
    var subject = createLoader();

    t.equal(subject.dirname, process.cwd());

    t.end();
  });

  suite.test('constructor accepts relative path', function (t) {
    var subject = createLoader('relative');

    t.equal(subject.dirname, path.join(process.cwd(), 'relative'));

    t.end();
  });

  suite.test('constructor accepts absolute path', function (t) {
    var subject = createLoader('/absolute');

    t.equal(subject.dirname, '/absolute');

    t.end();
  });

  suite.test('constructor returns loader function', function (t) {
    var subject = createLoader();

    t.ok(typeof subject === 'function');

    t.end();
  });

  suite.test('loader returns a Promise', function (t) {
    var subject = loader('test');

    t.ok(typeof subject.then === 'function');
    t.ok(typeof subject.catch === 'function');

    t.end();
  });

  suite.test('loader rejects bogus name', function (t) {
    loader('obviously-does-not-exist')
      .then(function () {
        t.end(new Error('Should have failed.'));
      }, function (err) {
        t.ok(err);

        t.end();
      });
  });

  suite.test('loader loads html', function (t) {
    loader('html-only')
      .then(function (subject) {
        t.equal(subject.path, path.join(loader.dirname, 'html-only.html'));
      })
      .then(t.end, t.end);
  });

  suite.test('loader loads html as stream', function (t) {
    loader('html-only')
      .then(function (subject) {
        t.ok(subject instanceof stream.Readable);
      })
      .then(t.end, t.end);
  });

  suite.test('loader loads md', function (t) {
    loader('md-only')
      .then(function (subject) {
        t.equal(subject.path, path.join(loader.dirname, 'md-only.md'));
      })
      .then(t.end, t.end);
  });

  suite.test('loader loads md as stream', function (t) {
    loader('md-only')
      .then(function (subject) {
        t.ok(subject instanceof stream.Readable);
      })
      .then(t.end, t.end);
  });

  suite.test('loader loads markdown', function (t) {
    loader('markdown-only')
      .then(function (subject) {
        t.equal(subject.path, path.join(loader.dirname, 'markdown-only.markdown'));
      })
      .then(t.end, t.end);
  });

  suite.test('loader loads markdown as stream', function (t) {
    loader('markdown-only')
      .then(function (subject) {
        t.ok(subject instanceof stream.Readable);
      })
      .then(t.end, t.end);
  });

  suite.test('loader loads txt', function (t) {
    loader('txt-only')
      .then(function (subject) {
        t.equal(subject.path, path.join(loader.dirname, 'txt-only.txt'));
      })
      .then(t.end, t.end);
  });

  suite.test('loader loads txt as stream', function (t) {
    loader('txt-only')
      .then(function (subject) {
        t.ok(subject instanceof stream.Readable);
      })
      .then(t.end, t.end);
  });

  suite.test('loader prefers html', function (t) {
    loader('priority-html')
      .then(function (subject) {
        t.equal(subject.path, path.join(loader.dirname, 'priority-html.html'));
      })
      .then(t.end, t.end);
  });

  suite.test('loader prefers md', function (t) {
    loader('priority-md')
      .then(function (subject) {
        t.equal(subject.path, path.join(loader.dirname, 'priority-md.md'));
      })
      .then(t.end, t.end);
  });

  suite.test('loader prefers markdown', function (t) {
    loader('priority-markdown')
      .then(function (subject) {
        t.equal(subject.path, path.join(loader.dirname, 'priority-markdown.markdown'));
      })
      .then(t.end, t.end);
  });
});
