'use strict';

const { promisify } = require('util');
const PDFFonts      = require('bindings')('pdffonts');

module.exports = {
  fonts: promisify(PDFFonts.fonts)
};
