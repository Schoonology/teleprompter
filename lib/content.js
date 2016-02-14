'use strict';

var fs = require('fs');
var marked = require('marked');

function loadContent(filename) {
  var markdown = fs.readFileSync(filename, 'utf8');

  return marked(markdown);
}

module.exports = loadContent;
