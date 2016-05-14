# pdffonts

[![Build Status](https://travis-ci.org/lob/pdffonts.svg?branch=master)](https://travis-ci.org/lob/pdffonts)
[![Coverage Status](https://coveralls.io/repos/github/lob/pdffonts/badge.svg?branch=master)](https://coveralls.io/github/lob/pdffonts?branch=master)

Node bindings for Poppler's `pdffonts` CLI.

## Dependencies

For this module to install and build correctly, you'll need to make sure that [`poppler`](https://poppler.freedesktop.org/) is installed on your machine.

To install Poppler on Mac OS X using Homebrew:

```
brew install poppler
```

To install Poppler on Ubuntu 14.04:

```
apt-get install pkg-config
apt-get install libpoppler-cpp-dev
```

**Note: The version of Poppler on `apt-get` on Ubuntu 12.04 doesn't contain all the functions necessary for this package. If you're using 12.04, you need to build the latest version Poppler from source.**

## Usage

#### `PDFFonts.fonts()`

```
Returns an array of font objects.
@param {String} path - path to the PDF
@returns {Array<Object>} array of font objects
```

Here's an example font object:

```js
{
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
}
```

## Testing

```bash
$ npm i
$ npm test
```

## Coverage

The coverage report is generated using [`lcov`](http://ltp.sourceforge.net/coverage/lcov.php), so you need to make sure you have it installed:

To install `lcov` on Mac OS X using Homebrew:

```bash
$ brew install lcov
```

To install `lcov` on Ubuntu 14.04:

```bash
$ apt-get install lcov
```

Once it's installed, you can generate a `coverage.info` file by running:

```bash
$ npm run cover
```

If you want to view it as an HTML file to see which lines haven't been covered, you can run the following to generate a `coverage/index.html`:

```bash
$ npm run cover:html
```

## Linting

```bash
$ npm run lint
```
