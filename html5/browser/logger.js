var config = require('./config')
var utils = require('./utils')

var _initialized = false

var logger = {
  log: function () {},
  warn: function () {},
  error: function () {}
}

function hijack(k) {
  if (utils.isArray(k)) {
    k.forEach(function (key) {
      hijack(key)
    })
  } else {
    if (console[k]) {
      logger[k] = function () {
        console[k].apply(
          console,
          ['[h5-render]'].concat(Array.prototype.slice.call(arguments, 0))
        )
      }
    }
  }
}

logger.init = function () {
  if (_initialized) {
    return
  }
  _initialized = true
  if (config.debug && console) {
    hijack(['log', 'warn', 'error'])
  }
}

module.exports = logger