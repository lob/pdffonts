'use strict';

var Path = require('path');

var PDFFonts = require('../lib/pdffonts');

var EMBEDDED_FONTS_PATH    = Path.resolve(__dirname, 'assets/embedded-fonts.pdf');
var NONEMBEDDED_FONTS_PATH = Path.resolve(__dirname, 'assets/nonembedded-fonts.pdf');
var NO_FONTS_PATH          = Path.resolve(__dirname, 'assets/no-fonts.pdf');
var NONEXISTENT_PATH       = Path.resolve(__dirname, 'assets/nonexistent.pdf');
var NON_PDF_PATH           = Path.resolve(__dirname, 'assets/non-pdf.png');

describe('pdffonts', function () {

  describe('fonts', function () {

    it('returns an array of font objects', function () {
      var fonts = PDFFonts.fonts(EMBEDDED_FONTS_PATH);
      expect(fonts).to.eql([{
        name: 'LDJWDV+DejaVuSerif-Bold',
        type: 'CID TrueType',
        encoding: 'Identity-H',
        embedded: true,
        subset: true,
        unicode: true,
        object: {
          number: 8,
          generation: 0
        }
      }]);
    });

    it('detects nonembedded fonts', function () {
      var fonts = PDFFonts.fonts(NONEMBEDDED_FONTS_PATH);
      fonts.forEach(function (font) {
        expect(font.embedded).to.be.false;
      });
    });

    it('returns an empty array if there are no fonts', function () {
      var fonts = PDFFonts.fonts(NO_FONTS_PATH);
      expect(fonts).to.be.empty;
    });

    it('throws an error if a file name is not passed in', function (done) {
      try {
        PDFFonts.fonts();
      } catch (err) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eql('file name is required');
        done();
      }
    });

    it('throws an error if a file does not exist', function (done) {
      try {
        PDFFonts.fonts(NONEXISTENT_PATH);
      } catch (err) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eql('file is not a valid PDF');
        done();
      }
    });

    it('throws an error if the file is not a PDF', function (done) {
      try {
        PDFFonts.fonts(NON_PDF_PATH);
      } catch (err) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eql('file is not a valid PDF');
        done();
      }
    });

  });

});
