'use strict';

const util = require('util');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

const translations = {
  CIDFontType2: 'CID TrueType',
  Type3: 'Type 3',
  FOO: 'CID Type 0',
  FOO: 'Type 1',
};

// const Bluebird = require('bluebird');

module.exports.fonts = async (path) => {
  const fonts = [];

  const pdf = await pdfjs.getDocument({
    url: path,
    fontExtraProperties: true,
    disableFontFace: false,
    useSystemFonts: false
  }).promise;

  // console.log('PDF STATS');
  // const stats = await pdf.getStats();
  // console.log(stats);
  // console.log('FUCK', pdf.numPages);

  let encounteredFonts = {};

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    // console.log('PAGE OBJS COMMON OBJS');
    // console.log(util.inspect(page.objs, true, null, true));
    // console.log(util.inspect(page.commonObjs, true, null, true));

    // console.log('GET OPERATOR LIST');
    // console.log(util.inspect(await page.getOperatorList(), true, null, true));

    const content = await page.getTextContent();
    encounteredFonts = {...encounteredFonts, ...content.styles};
  }

  // console.log('FONTS USED IN ALL PAGES', encounteredFonts);

  const keys = Object.keys(encounteredFonts);

  for (let key of keys) {
    const font = encounteredFonts[key];
    fonts.push({
      name: font.name,
      type: translations[font.type] || font.type,
      encoding: font.encoding,
      embedded: font.embedded,
      subset: font.subset,
      // unicode: font.unicode, // unused by Lob API
      // object: font.object // unused by Lob API
    });
  }

  return fonts;
};

// const PDFFonts = require('bindings')('pdffonts');

// module.exports = {
  // fonts: Bluebird.promisify(PDFFonts.fonts)
// };
