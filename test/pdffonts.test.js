'use strict';

var Pdffonts = require('../lib/pdffonts');

describe('pdffonts', function () {

  describe('hello', function () {

    it('returns "world"', function () {
      expect(Pdffonts.hello()).to.eql('world');
    });

  });

});
