'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var marked = require('marked');
var through = require('through2');

function createLoader(dirname) {
  loadContent.dirname = path.resolve(process.cwd(), dirname || '');

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
    return new Promise.fromCallback(function (callback) {
      fs.readdir(loadContent.dirname, callback);
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
