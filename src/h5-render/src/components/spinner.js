'use strict'

var Atomic = require('./atomic')
var utils = require('../utils')

require('../styles/spinner.css')

function Spinner (data) {
  Atomic.call(this, data)
}

Spinner.prototype = Object.create(Atomic.prototype)

Spinner.prototype.create = function () {
  var node = document.createElement('div')
  node.classList.add('weex-container', 'weex-spinner-wrap')
  this.spinner = document.createElement('div')
  this.spinner.classList.add('weex-element', 'weex-spinner')
  node.appendChild(this.spinner)
  return node
}

Spinner.prototype.updateStyle = function (style) {
  Atomic.prototype.updateStyle.call(this, style)
  if (style && style.color) {
    this.setKeyframeColor(utils.getRgb(this.node.style.color))
  }
}

Spinner.prototype.getStyleSheet = function () {
  if (this.styleSheet) {
    return
  }
  var styles = document.styleSheets
  outer: for (var i = 0, l = styles.length; i < l; i++) {
    var rules = styles[i].rules
    for (var j = 0, m = rules.length; j < m; j++) {
      var item = rules.item(j)
      if (
        (item.type === CSSRule.KEYFRAMES_RULE
          || item.type === CSSRule.WEBKIT_KEYFRAMES_RULE)
        && item.name === 'spinner') {
        break outer
      }
    }
  }
  this.styleSheet = styles[i]
}

Spinner.prototype.setKeyframeColor = function (val) {
  this.getStyleSheet()
  var keyframeRules = this.computeKeyFrameRules(val)
  var rules, item, cssRules, keyframe
  rules = this.styleSheet.rules
  for (var i = 0, l = rules.length; i < l; i++) {
    item = rules.item(i)
    if ((item.type === CSSRule.KEYFRAMES_RULE
          || item.type === CSSRule.WEBKIT_KEYFRAMES_RULE)
        && item.name === 'spinner') {
      cssRules = item.cssRules
      for (var j = 0, m = cssRules.length; j < m; j++) {
        keyframe = cssRules[j]
        if (keyframe.type === CSSRule.KEYFRAME_RULE
          || keyframe.type === CSSRule.WEBKIT_KEYFRAME_RULE) {
          keyframe.style.boxShadow = keyframeRules[j]
        }
      }
    }
  }
}

Spinner.prototype.computeKeyFrameRules = function (rgb) {
  if (!rgb) {
    return
  }
  var scaleArr = [
    '0em -2.6em 0em 0em',
    '1.8em -1.8em 0 0em',
    '2.5em 0em 0 0em',
    '1.75em 1.75em 0 0em',
    '0em 2.5em 0 0em',
    '-1.8em 1.8em 0 0em',
    '-2.6em 0em 0 0em',
    '-1.8em -1.8em 0 0em']
  var colorArr = [
    '1',
    '0.2',
    '0.2',
    '0.2',
    '0.2',
    '0.2',
    '0.5',
    '0.7'].map(function (e) {
      return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + e + ')'
    })
  var rules = []
  for (var i = 0; i < scaleArr.length; i++) {
    var tmpColorArr = utils.loopArray(colorArr, i, 'r')
    rules.push(scaleArr.map(function (scaleStr, i) {
      return scaleStr + ' ' + tmpColorArr[i]
    }).join(', '))
  }
  return rules
}

module.exports = Spinner
