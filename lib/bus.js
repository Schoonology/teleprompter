'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');

function createBus() {
  var emitter = new EventEmitter();
  var bus = {};

  bus.addListener = function addListener(handler) {
    return emitter.addListener('event', handler);
  }

  bus.removeListener = function removeListener(handler) {
    return emitter.removeListener('event', handler);
  }

  bus.emit = function emit(type, body) {
    var merged = util._extend({}, body);

    merged.type = type;

    return emitter.emit('event', merged);
  }

  return bus;
}

module.exports = createBus;
