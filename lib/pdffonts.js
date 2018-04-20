'use strict';

const Bluebird = require('bluebird');

const pdffonts = require('bindings')('pdffonts');

module.exports = {
  fonts: Bluebird.promisify(pdffonts.fonts)
};
