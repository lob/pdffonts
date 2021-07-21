'use strict';

const Path = require('path');

const PDFFonts = require('../lib/pdffonts');

const EMBEDDED_FONTS_PATH    = Path.resolve(__dirname, 'assets/embedded-fonts.pdf');
const INVALID_OBJECT_ID_PATH = Path.resolve(__dirname, 'assets/invalid-object-id.pdf');
const NO_FONTS_PATH          = Path.resolve(__dirname, 'assets/no-fonts.pdf');
const NON_PDF_PATH           = Path.resolve(__dirname, 'assets/non-pdf.png');
const NONEMBEDDED_FONTS_PATH = Path.resolve(__dirname, 'assets/nonembedded-fonts.pdf');
const NONEXISTENT_PATH       = Path.resolve(__dirname, 'assets/nonexistent.pdf');
const TYPE_3_FONT_PATH       = Path.resolve(__dirname, 'assets/type-3-font.pdf');
const LANGUAGE_PACK_REQUIRED = Path.resolve(__dirname, 'assets/language-pack-required.pdf');

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
          subset: true
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

    it('handles Type 3 fonts', () => {
      return PDFFonts.fonts(TYPE_3_FONT_PATH)
      .then((fonts) => {
        expect(fonts).to.eql([{
          name: null,
          type: 'Type 3',
          encoding: 'Custom',
          embedded: true,
          subset: false
        }]);
      });
    });

    it('handles fonts with invalid object ID', () => {
      return PDFFonts.fonts(INVALID_OBJECT_ID_PATH)
      .then((fonts) => {
        // TODO: THIS IS AN EMPTY ARRAY
        expect(fonts.length).to.eql(1);
      });
    });

    it('handles language pack-required mappings', () => {
      // TODO: Broke as hell
      return PDFFonts.fonts(LANGUAGE_PACK_REQUIRED)
      .then((fonts) => {
        expect(fonts).to.eql([
          {
            name: 'DotumChe',
            type: 'CID Type 0',
            encoding: 'KSCms-UHC-H',
            embedded: false,
            subset: false
          }, {
            name: 'SimSun',
            type: 'CID Type 0',
            encoding: 'GBK-EUC-H',
            embedded: false,
            subset: false
          }, {
            name: 'MS-Gothic',
            type: 'CID Type 0',
            encoding: '90ms-RKSJ-H',
            embedded: false,
            subset: false
          }, {
            name: 'MingLiU',
            type: 'CID Type 0',
            encoding: 'ETen-B5-H',
            embedded: false,
            subset: false
          }, {
            name: 'Helvetica',
            type: 'Type 1',
            encoding: 'Custom',
            embedded: false,
            subset: false
          }, {
            name: 'Helvetica',
            type: 'Type 1',
            encoding: 'Custom',
            embedded: false,
            subset: false
          }, {
            name: 'Helvetica',
            type: 'Type 1',
            encoding: 'Custom',
            embedded: false,
            subset: false
          }
        ]);
      });
    });

    it('throws an error if a file name is not passed in', () => {
      return PDFFonts.fonts()
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Error);
        // TODO: rename error
        // expect(err.message).to.eql('expected 2 arguments');
      });
    });

    it('throws an error if first argument is not a string', () => {
      return PDFFonts.fonts(42)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Error);
        // TODO: rename error
        // expect(err.message).to.eql('expected arg 0: string filename');
      });
    });

    it.skip('throws an error if second argument is not a function', () => {
      const callbackPDFFonts = require('bindings')('pdffonts');

      let err;

      try {
        callbackPDFFonts.fonts(NO_FONTS_PATH, 'notAFunction');
      } catch (e) {
        err = e;
      }
      expect(err).to.be.an.instanceof(Error);
      // expect(err.message).to.eql('expected arg 1: function callback');
    });

    it('throws an error if a file does not exist', () => {
      return PDFFonts.fonts(NONEXISTENT_PATH)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Error);
        // expect(err.message).to.eql('file is not a valid PDF');
      });
    });

    it('throws an error if the file is not a PDF', () => {
      return PDFFonts.fonts(NON_PDF_PATH)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Error);
        // expect(err.message).to.eql('file is not a valid PDF');
      });
    });

  });

});
