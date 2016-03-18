'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');

function createLoadDirectory(resolvePath) {
  if (typeof resolvePath !== 'function') {
    throw new TypeError('createLoadDirectory requires a function.');
  }

  return loadDirectory;

  // Returns a Promise to be resolved with an Array of names.
  function loadDirectory() {
    return resolvePath()
      .then(function (dirname) {
        return new Promise.fromCallback(function (callback) {
          fs.readdir(dirname, callback);
        });
      })
      .then(function (files) {
        files = files
          .map(function (filename) {
            return filename.slice(0, -path.extname(filename).length);
          })
          .sort()
          .filter(function (filename, index, arr) {
            return arr[index - 1] !== filename;
          });

        return files;
      });
  }
}

module.exports = createLoadDirectory;
