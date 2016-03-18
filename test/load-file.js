'use strict';

var path = require('path');
var stream = require('stream');
var Promise = require('bluebird');
var loadStreamBody = require('raw-body');
var tape = require('tape');
var createLoadFile = require('../lib/load-file');
var createResolver = require('../lib/resolve-path');

tape.test('loadFile', function (suite) {
  var resolvePath = createResolver(path.resolve(__dirname, 'fixture/loader'));
  var loadFile = createLoadFile(resolvePath);

  suite.test('constructor requires a function', function (t) {
    t.plan(1);

    try {
      createLoadFile();
    } catch (err) {
      t.equal(err.name, 'TypeError');
    }

    t.end();
  });

  suite.test('constructor returns loadFile function', function (t) {
    var subject = createLoadFile(resolvePath);

    t.ok(typeof subject === 'function');

    t.end();
  });

  suite.test('loadFile returns a Promise', function (t) {
    var subject = loadFile('test');

    t.ok(subject instanceof Promise);

    t.end();
    subject.catch(function noop() {});
  });

  suite.test('loadFile rejects bogus name', function (t) {
    loadFile('obviously-does-not-exist')
      .then(function () {
        t.end(new Error('Should have failed.'));
      }, function (err) {
        t.ok(err);

        t.end();
      });
  });

  suite.test('loadFile loads html', function (t) {
    loadFile('html-only')
      .then(function (subject) {
        t.equal(subject.path, path.join(resolvePath.dirname, 'html-only.html'));
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile loads html as stream', function (t) {
    loadFile('html-only')
      .then(function (subject) {
        t.ok(subject instanceof stream.Stream);
        t.ok(typeof subject.read === 'function', 'has read function');
        t.ok(typeof subject.pipe === 'function', 'has pipe function');
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile loads md', function (t) {
    loadFile('md-only')
      .then(function (subject) {
        t.equal(subject.path, path.join(resolvePath.dirname, 'md-only.md'));
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile loads md as stream', function (t) {
    loadFile('md-only')
      .then(function (subject) {
        t.ok(subject instanceof stream.Stream);
        t.ok(typeof subject.read === 'function', 'has read function');
        t.ok(typeof subject.pipe === 'function', 'has pipe function');
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile loads markdown', function (t) {
    loadFile('markdown-only')
      .then(function (subject) {
        t.equal(subject.path, path.join(resolvePath.dirname, 'markdown-only.markdown'));
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile loads markdown as stream', function (t) {
    loadFile('markdown-only')
      .then(function (subject) {
        t.ok(subject instanceof stream.Stream);
        t.ok(typeof subject.read === 'function', 'has read function');
        t.ok(typeof subject.pipe === 'function', 'has pipe function');
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile loads txt', function (t) {
    loadFile('txt-only')
      .then(function (subject) {
        t.equal(subject.path, path.join(resolvePath.dirname, 'txt-only.txt'));
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile loads txt as stream', function (t) {
    loadFile('txt-only')
      .then(function (subject) {
        t.ok(subject instanceof stream.Stream);
        t.ok(typeof subject.read === 'function', 'has read function');
        t.ok(typeof subject.pipe === 'function', 'has pipe function');
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile prefers html', function (t) {
    loadFile('priority-html')
      .then(function (subject) {
        t.equal(subject.path, path.join(resolvePath.dirname, 'priority-html.html'));
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile prefers md', function (t) {
    loadFile('priority-md')
      .then(function (subject) {
        t.equal(subject.path, path.join(resolvePath.dirname, 'priority-md.md'));
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile prefers markdown', function (t) {
    loadFile('priority-markdown')
      .then(function (subject) {
        t.equal(subject.path, path.join(resolvePath.dirname, 'priority-markdown.markdown'));
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile parses md', function (t) {
    loadFile('md-only')
      .then(function (subject) {
        return loadStreamBody(subject);
      })
      .then(function (body) {
        t.equal(String(body.slice(0, 3)), '<p>');
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile parses markdown', function (t) {
    loadFile('markdown-only')
      .then(function (subject) {
        return loadStreamBody(subject);
      })
      .then(function (body) {
        t.equal(String(body.slice(0, 3)), '<p>');
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile parses txt', function (t) {
    loadFile('txt-only')
      .then(function (subject) {
        return loadStreamBody(subject);
      })
      .then(function (body) {
        t.equal(String(body.slice(0, 3)), '<p>');
      })
      .then(t.end, t.end);
  });

  suite.test('loadFile preserves html', function (t) {
    loadFile('html-only')
      .then(function (subject) {
        return loadStreamBody(subject);
      })
      .then(function (body) {
        t.equal(String(body.slice(0, 3)), '<p>');
      })
      .then(t.end, t.end);
  });
});
