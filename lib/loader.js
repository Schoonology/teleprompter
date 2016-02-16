'use strict';

var fs = require('fs');
var path = require('path');
var bluebird = require('bluebird');
var marked = require('marked');
var through = require('through2');

function createLoader(dirname) {
  loadContent.dirname = path.resolve(process.cwd(), dirname || '');

  return loadContent;

  // Returns a Promise to be resolved with an fs.ReadStream of the named file's
  // rendered contents.
  function loadContent(name) {
    var basename = path.join(loadContent.dirname, name);

    // Try each file extension, returning a ReadStream for the first to succeed.
    // The order of the extensions, then, is the order of priority if multiple
    // such files exist.
    return ['html', 'md', 'markdown', 'txt']
      .reduce(function (prev, ext) {
        return prev.catch(function () {
          return new Promise(function (resolve, reject) {
            var stream = fs.createReadStream(basename + '.' + ext)
              .on('error', reject)
              .on('open', function () {
                resolve(stream);
              });
          });
        });
      }, Promise.reject('Failed to read files.'))
      .catch(function () {
        return Promise.reject('No such file found.');
      })
      // Markdown as a syntax requires knowledge of the entire body of the
      // file, so we briefly buffer the input stream before parsing for output.
      .then(function (stream) {
        var buffer = [];
        var parser = through(
          function transform(chunk, enc, callback) {
            buffer.push(chunk);

            callback();
          },
          function flush(callback) {
            this.push(marked(buffer.join('')));
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
