'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var marked = require('marked');
var through = require('through2');

function createResolver(dirname) {
  resolvePath.dirname = path.resolve(process.cwd(), dirname || '');

  return resolvePath;

  // Returns the a Promise to be resolved with the proper filepath to use for
  // the named script file.
  function resolvePath(name) {
    var basename = path.join(resolvePath.dirname, name || '');

    if (!name) {
      return new Promise.fromCallback(function (callback) {
        fs.stat(basename, callback);
      })
        .then(function () {
          return basename;
        });
    }

    // Try each file extension, returning a ReadStream for the first to succeed.
    // The order of the extensions, then, is the order of priority if multiple
    // such files exist.
    return ['html', 'md', 'markdown', 'txt']
      .reduce(function (prev, ext) {
        return prev.catch(function () {
          return new Promise.fromCallback(function (callback) {
            fs.stat(basename + '.' + ext, callback);
          })
            .then(function () {
              return basename + '.' + ext;
            });
        });
      }, Promise.reject('Failed to read files.'));
  }
}

module.exports = createResolver;
