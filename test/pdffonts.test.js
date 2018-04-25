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
      return PDFFonts.fonts(EMBEDDED_FONTS_PATH)
      .then((fonts) => {
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
    });

    it('detects nonembedded fonts', () => {
      return PDFFonts.fonts(NONEMBEDDED_FONTS_PATH)
      .then((fonts) => {
        fonts.forEach((font) => {
          expect(font.embedded).to.be.false;
        });
      });
    });

    it('returns an empty array if there are no fonts', () => {
      return PDFFonts.fonts(NO_FONTS_PATH)
      .then((fonts) => {
        expect(fonts).to.be.empty;
      });
    });

    it('throws an error if a file name is not passed in', () => {
      return PDFFonts.fonts()
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eql('expected 2 arguments');
      });
    });

    it('throws an error if first argument is not a string', () => {
      return PDFFonts.fonts(42)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eql('expected arg 0: string filename');
      });
    });

    it('throws an error if second argument is not a function', () => {
      const callbackPDFFonts = require('bindings')('pdffonts');

      try {
        callbackPDFFonts.fonts(NO_FONTS_PATH, 'notAFunction');
      } catch (err) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eql('expected arg 1: function callback');
      }
    });

    it('throws an error if a file does not exist', () => {
      return PDFFonts.fonts(NONEXISTENT_PATH)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eql('file is not a valid PDF');
      });
    });

    it('throws an error if the file is not a PDF', () => {
      return PDFFonts.fonts(NON_PDF_PATH)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.eql('file is not a valid PDF');
      });
    });

  });

});
