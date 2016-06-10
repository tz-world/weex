'use strict'

var logger = require('./logger')

if (!window.Promise) {
  logger.warn('native Promise is missing, using polyfill instead.')
  require('es6-promise')
}