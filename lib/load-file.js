'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var marked = require('marked');
var through = require('through2');
var Readable = require('stream').Readable;
/*var iconv = require('iconv-lite');*/
var mammoth = require('mammoth');

function createLoadFile(resolvePath) {
  if (typeof resolvePath !== 'function') {
    throw new TypeError('createLoadFile requires a function.');
  }

  return loadFile;

  async function docConvert(filename) {
    var html = (await mammoth.convertToHtml({path: filename})).value;
    var htmlStream = new Readable();
    htmlStream.push(html);    // the string you want
    htmlStream.push(null);      // indicates end-of-file basically - the end of the stream
    return htmlStream;
  }

  // Returns a Promise to be resolved with an fs.ReadStream of the named file's
  // rendered contents.
  function loadFile(name) {
    return resolvePath(name)
      .then(function (filename) {
        /* to add docx functionality, we need check if the file is first a docx.
        Can't be read like a file stream since it's not really plaintext like the other formats.
        */
        if (path.extname(filename) == ".docx") {
            return docConvert(filename);
        } else {
          return fs.createReadStream(filename);
          //return fs.createReadStream(filename).pipe(iconv.decodeStream('win1251'));
        }
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

module.exports = createLoadFile;
