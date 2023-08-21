const Behavior = require('../Behavior');
var format = function (text) {
  if (!text) {
    return;
  }

  var reg = getRegExp('\\\\n', 'g');
  return text.replace(reg, '\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
};

var limit = function (array, length) {
  return array.slice(0, length);
};

module.exports = {
  format: format,
  limit: limit
};