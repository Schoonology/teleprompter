'use strict';

var EventEmitter = require('events').EventEmitter;
var tape = require('tape');
var createBus = require('../lib/bus');

function noop() {}

tape.test('Bus', function (suite) {
  suite.test('constructor returns a valid Bus', function (t) {
    var subject = createBus();

    t.ok(typeof subject === 'object');
    t.ok(typeof subject.addListener === 'function');
    t.ok(typeof subject.removeListener === 'function');

    t.end();
  });

  suite.test('bus.addListener accepts a function', function (t) {
    var subject = createBus();

    subject.addListener(noop);

    t.end();
  });

  suite.test('bus.removeListener accepts a function', function (t) {
    var subject = createBus();

    subject.removeListener(noop);

    t.end();
  });

  suite.test('bus.emit accepts a name and a body', function (t) {
    var subject = createBus();

    subject.emit('name', {});

    t.end();
  });

  suite.test('bus.emit does not require a name or a body', function (t) {
    var subject = createBus();

    subject.emit();

    t.end();
  });

  suite.test('bus.emit fires event on added listener', function (t) {
    var subject = createBus();
    var events = [];

    subject.addListener(function (val) {
      events.push(val);
    });
    subject.emit();

    t.equal(events.length, 1);
    t.end();
  });

  suite.test('bus listeners receive event type in body', function (t) {
    var subject = createBus();
    var events = [];

    subject.addListener(function (val) {
      events.push(val);
    });
    subject.emit('test_event');

    t.equal(events.length, 1);
    t.equal(events[0].type, 'test_event');
    t.end();
  });

  suite.test('bus listeners receive merged event type and body', function (t) {
    var subject = createBus();
    var events = [];

    subject.addListener(function (val) {
      events.push(val);
    });
    subject.emit('test_event', { test_key: 'test_value' });

    t.equal(events.length, 1);
    t.equal(events[0].type, 'test_event');
    t.equal(events[0].test_key, 'test_value');
    t.end();
  });

  suite.test('bus.emit does not mutate body', function (t) {
    var subject = createBus();
    var body = { test_key: 'test_value' };

    subject.emit('test_event', body);

    t.ok(typeof body.type === 'undefined');

    t.end();
  });

  suite.test('bus.emit does not fire event on removed listener', function (t) {
    var subject = createBus();
    var events = [];

    function onEvent(val) {
      events.push(val);
    }

    subject.addListener(onEvent);
    subject.removeListener(onEvent);
    subject.emit();

    t.equal(events.length, 0);
    t.end();
  });
});
