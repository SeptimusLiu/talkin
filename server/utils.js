
/**
 * Pick a random number to generate ID for user and channel.
 * @return {[number]}
 */
var utils = {};

utils.pickId = function () {
  var number = (new Date()).getTime();
  for (var i = 0; i < 4; i++) {
    number += (Math.floor(Math.random()*10)).toString();
  }
  return parseInt(number);
};

module.exports = utils;