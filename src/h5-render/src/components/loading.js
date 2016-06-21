'use strict'

var Component = require('./component')
var utils = require('../utils')
var logger = require('../logger')

require('../styles/loading.css')

var parents = ['scroller', 'list']

var DEFAULT_CLAMP = 130
var DEFAULT_ALIGN_ITEMS = 'center'
var DEFAULT_JUSTIFY_CONTENT = 'center'

var ua = window.navigator.userAgent
var Firefox = !!ua.match(/Firefox/i)
var IEMobile = !!ua.match(/IEMobile/i)
var cssPrefix = Firefox ? '-moz-' : IEMobile ? '-ms-' : '-webkit-'

function Loading (data) {
  this.clamp = (data.style.height || DEFAULT_CLAMP) * data.scale
  !data.style.alignItems && (data.style.alignItems = DEFAULT_ALIGN_ITEMS)
  !data.style.justifyContent
    && (data.style.justifyContent = DEFAULT_JUSTIFY_CONTENT)
  Component.call(this, data)
}

Loading.prototype = Object.create(Component.prototype)

Loading.prototype.create = function () {
  var node = document.createElement('div')
  node.classList.add('weex-container', 'weex-loading')
  return node
}

Loading.prototype.onAppend = function () {
  var parent = this.getParent()
  var self = this
  var scrollWrapHeight = parent.node.getBoundingClientRect().height
  if (parents.indexOf(parent.data.type) === -1) {
    return
  }
  parent.scroller.addEventListener('pullup', function (e) {
    var obj = e.scrollObj
    self.adjustHeight(Math.abs(
      obj.getScrollHeight() - obj.getScrollTop() - scrollWrapHeight))
    if (!self.display) {
      self.show()
    }
  })
  parent.scroller.addEventListener('pullupend', function (e) {
    self.handleLoading(e)
  })
}

Loading.prototype.adjustHeight = function (val) {
  this.node.style.height = val + 'px'
  this.node.style.bottom = -val + 'px'
}

Loading.prototype.handleLoading = function (e) {
  var parent = this.getParent()
  var scrollElement = parent.scrollElement || parent.listElement
  var offset = scrollElement.getBoundingClientRect().height
            - parent.node.getBoundingClientRect().height
            + this.clamp
  this.node.style.height = this.clamp + 'px'
  this.node.style.bottom = -this.clamp + 'px'
  var translateStr = 'translate3d(0px,-' + offset + 'px,0px)'
  scrollElement.style[cssPrefix + 'transform']
    = cssPrefix + translateStr
  scrollElement.style.transform = translateStr
  this.dispatchEvent('loading')
}

Loading.prototype.show = function () {
  this.display = true
  this.node.style.display = '-webkit-box'
  this.node.style.display = '-webkit-flex'
  this.node.style.display = 'flex'
}

Loading.prototype.hide = function () {
  this.display = false
  var parent = this.getParent()
  if (parent) {
    var scrollElement = parent.scrollElement || parent.listElement
    var scrollElementHeight = scrollElement.getBoundingClientRect().height
    var scrollWrapHeight = parent.node.getBoundingClientRect().height
    var left = scrollElementHeight
      - parent.scroller.getScrollTop()
      - scrollWrapHeight
    if (left < 0) {
      var offset = scrollElementHeight
              - parent.node.getBoundingClientRect().height
      var translateStr = 'translate3d(0px,-' + offset + 'px,0px)'
      scrollElement.style[cssPrefix + 'transform']
        = cssPrefix + translateStr
      scrollElement.style.transform = translateStr
    }
  }
  this.node.style.display = 'none'
}

Loading.prototype.attr = {
  display: function (val) {
    if (val === 'show') {
      setTimeout(function () {
        this.show()
      }.bind(this), 0)
    } else if (val === 'hide') {
      setTimeout(function () {
        this.hide()
      }.bind(this), 0)
    } else {
      // TODO
      console.error('h5render:attribute value of refresh \'display\' '
          + val
          + ' is invalid. Should be \'show\' or \'hide\'')
    }
  }
}

Loading.prototype.style = utils.extend(
  Object.create(Component.prototype.style), {
    height: function (val) {
      val = parseFloat(val)
      if (Number.isNaN(val) || val < 0) {
        return logger.warn('<loading>\'s height (' + val + ') is invalid.')
      }
      this.clamp = val * this.data.scale
    }
  })

module.exports = Loading
