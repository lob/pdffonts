'use strict';

const Bluebird = require('bluebird');

const PDFFonts = require('bindings')('pdffonts');

module.exports = {
  fonts: Bluebird.promisify(PDFFonts.fonts)
};
