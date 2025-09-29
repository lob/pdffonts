# pdffonts

[![Build Status](https://github.com/lob/pdffonts/actions/workflows/ci.yaml/badge.svg)](https://github.com/lob/pdffonts/actions/workflows/ci.yaml)

Node bindings for Poppler's `pdffonts` CLI.

## Dependencies

For this module to install and build correctly, you'll need to make sure that [`poppler`](https://poppler.freedesktop.org/) is installed on your machine.

To install Poppler on Mac OS X using Homebrew:

```
brew install poppler
```

To install Poppler on Ubuntu/Debian:

```
apt-get install pkg-config
apt-get install libpoppler-private-dev
apt-get install poppler-data
```

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

## Publishing to npm
Our github action "Publish" automatically publishes the package to npm upon pushes to the 'main' branch
