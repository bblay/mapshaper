/* @require mapshaper-common */

// List of encodings supported by iconv-lite:
// https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings

// Return list of supported encodings
MapShaper.getEncodings = function() {
  var iconv = require('iconv-lite');
  iconv.encodingExists('ascii'); // make iconv load its encodings
  return Object.keys(iconv.encodings);
};

MapShaper.encodingIsSupported = function(raw) {
  var enc = MapShaper.standardizeEncodingName(raw);
  return utils.contains(MapShaper.getEncodings(), enc);
};

MapShaper.decodeString = function(buf, encoding) {
  var iconv = require('iconv-lite'),
      str = iconv.decode(buf, encoding);
  // remove BOM if present
  if (str.charCodeAt(0) == 0xfeff) {
    str = str.substr(1);
  }
  return str;
};

// Ex. convert UTF-8 to utf8
MapShaper.standardizeEncodingName = function(enc) {
  return enc.toLowerCase().replace(/[_-]/g, '');
};

// Format an array of (preferably short) strings in columns for console logging.
MapShaper.formatStringsAsGrid = function(arr) {
  // TODO: variable column width
  var longest = arr.reduce(function(len, str) {
        return Math.max(len, str.length);
      }, 0),
      colWidth = longest + 1,
      perLine = Math.floor(80 / colWidth) || 1;
  return arr.reduce(function(str, name, i) {
    if (i > 0 && i % perLine === 0) str += '\n';
    return str + ' ' + utils.rpad(name, colWidth-1, ' ');
  }, '');
};

MapShaper.printEncodings = function() {
  var encodings = MapShaper.getEncodings().filter(function(name) {
    // filter out some aliases and non-applicable encodings
    return !/^(_|cs|internal|ibm|isoir|singlebyte|table|[0-9]|l[0-9]|windows)/.test(name);
  });
  encodings.sort();
  console.log("Supported encodings:");
  console.log(MapShaper.formatStringsAsGrid(encodings));
};
