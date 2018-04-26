'use strict';

const Path = require('path');

const PDFFonts = require('../lib/pdffonts');

const EMBEDDED_FONTS_PATH    = Path.resolve(__dirname, 'assets/embedded-fonts.pdf');
const NONEMBEDDED_FONTS_PATH = Path.resolve(__dirname, 'assets/nonembedded-fonts.pdf');
const NO_FONTS_PATH          = Path.resolve(__dirname, 'assets/no-fonts.pdf');
const NONEXISTENT_PATH       = Path.resolve(__dirname, 'assets/nonexistent.pdf');
const NON_PDF_PATH           = Path.resolve(__dirname, 'assets/non-pdf.png');

describe('pdffonts', () => {

  describe('fonts', () => {

    it('returns an array of font objects', () => {
      const fonts = PDFFonts.fonts(EMBEDDED_FONTS_PATH);
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

    it('detects nonembedded fonts', () => {
      const fonts = PDFFonts.fonts(NONEMBEDDED_FONTS_PATH);
      fonts.forEach((font) => {
        expect(font.embedded).to.be.false;
      });
    });

    it('returns an empty array if there are no fonts', () => {
      const fonts = PDFFonts.fonts(NO_FONTS_PATH);
      expect(fonts).to.be.empty;
    });

    it('throws an error if a file name is not passed in', (done) => {
      try {
        PDFFonts.fonts();
      } catch (err) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eql('file name is required');
        done();
      }
    });

    it('throws an error if a file does not exist', (done) => {
      try {
        PDFFonts.fonts(NONEXISTENT_PATH);
      } catch (err) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eql('file is not a valid PDF');
        done();
      }
    });

    it('throws an error if the file is not a PDF', (done) => {
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
