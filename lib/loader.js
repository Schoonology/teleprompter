'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var marked = require('marked');
var through = require('through2');

function createLoader(resolvePath) {
  if (typeof resolvePath !== 'function') {
    throw new TypeError('createLoader requires a function.');
  }

  return loadContent;

  // Returns a Promise to be resolved with an fs.ReadStream of the named file's
  // rendered contents, or with an Array of names if none is provided.
  function loadContent(name) {
    if (name) {
      return loadFile(name);
    } else {
      return loadDirectory();
    }
  }

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

  // Returns a Promise to be resolved with an fs.ReadStream of the named file's
  // rendered contents.
  function loadFile(name) {
    return resolvePath(name)
      .then(function (filename) {
        return fs.createReadStream(filename);
      })
      // To handle parts of the Markdown syntax (such as [][] links) properly
      // requires knowledge of the file beyond the current chunk. Therefore a
      // lot of parsers like Marked require the _entire_ body be know. We
      // maintain a streaming interface to capitalize on improvements in this
      // department down the road, but for now we need to briefly buffer the
      // input stream before parsing for output.
      .then(function (stream) {
        var buffer = [];
        var parser = through(
          function transform(chunk, enc, callback) {
            buffer.push(chunk);

            callback();
          },
          function flush(callback) {
            // Marked doesn't sanitize "smart quotes", but a few `replace`
            // statements will make quick work of that. Additional sanitization
            // can be added here later, should the need arise.
            this.push(
              marked(buffer.join(''))
                .replace(/‘/g, '&lsquo;').replace(/’/g, '&rsquo;')
                .replace(/“/g, '&ldquo;').replace(/”/g, '&rdquo;')
            );
            this.push(null);

            callback();
          }
        );

        parser.path = stream.path;

        stream.pipe(parser);

        return parser;
      });
  }
}

module.exports = createLoader;
