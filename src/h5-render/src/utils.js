'use strict'

var WEAPP_STYLE_ID = 'weapp-style'

var _isWebpSupported = false

; (function isSupportWebp() {
  try {
    var webP = new Image()
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdA'
              + 'SoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    webP.onload = function () {
      if (webP.height === 2) {
        _isWebpSupported = true
      }
    }
  } catch (e) {
    // do nothing.
  }
})()

function extend(to, from) {
  for (var key in from) {
    to[key] = from[key]
  }
  return to
}

function isArray(arr) {
  return Array.isArray
    ? Array.isArray(arr)
    : (Object.prototype.toString.call(arr) === '[object Array]')
}

function appendStyle(css, styleId, replace) {
  var style = document.getElementById(styleId)
  if (style && replace) {
    style.parentNode.removeChild(style)
    style = null
  }
  if (!style) {
    style = document.createElement('style')
    style.type = 'text/css'
    styleId && (style.id = styleId)
    document.getElementsByTagName('head')[0].appendChild(style)
  }
  style.appendChild(document.createTextNode(css))
}

function getUniqueFromArray(arr) {
  if (!isArray(arr)) {
    return []
  }
  var res = []
  var unique = {}
  var val
  for (var i = 0, l = arr.length; i < l; i++) {
    val = arr[i]
    if (unique[val]) {
      continue
    }
    unique[val] = true
    res.push(val)
  }
  return res
}

function transitionize(element, props) {
  var transitions = []
  for (var key in props) {
    transitions.push(key + ' ' + props[key])
  }
  element.style.transition = transitions.join(', ')
  element.style.webkitTransition = transitions.join(', ')
}

function detectWebp() {
  return _isWebpSupported
}

function getRandom(num) {
  var _defaultNum = 10
  if (typeof num !== 'number' || num <= 0) {
    num = _defaultNum
  }
  var _max = Math.pow(10, num)
  return Math.floor(Date.now() + Math.random() * _max) % _max
}

function getRgb(color) {
  var match
  color = color + ''
  if (match = color.match(/#(\d{2})(\d{2})(\d{2})/)) {
    return {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16)
    }
  }
  if (match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    }
  }
}

// direction: 'l' | 'r', default is 'r'
// num: how many times to loop, should be a positive integer
function loopArray(arr, num, direction) {
  if (!isArray(arr)) {
    return
  }
  var isLeft = (direction + '').toLowerCase() === 'l'
  var len = arr.length
  num = num % len
  if (num < 0) {
    num = -num
    isLeft = !isLeft
  }
  if (num === 0) {
    return arr
  }
  var res, lp, rp
  if (isLeft) {
    lp = arr.slice(0, num)
    rp = arr.slice(num)
  } else {
    lp = arr.slice(0, len - num)
    rp = arr.slice(len - num)
  }
  return rp.concat(lp)
}

// pad a integer number with zeros on the left.
// example: fillInt(12, 3) -> '012'
// - num: the number to pad
// - len: the specified length
function leftPad(num, len) {
  if (len <= 0) {
    return num
  }
  var numLen = (num + '').length
  if (numLen >= len) {
    return num
  }
  return new Array(len - numLen + 1).join('0') + num
}

// get DateStr with specified separator like '2016-06-03'
function getDateStr(separator) {
  var dt = new Date()
  var y = dt.getFullYear()
  var m = leftPad(dt.getMonth() + 1, 2)
  var d = leftPad(dt.getDate(), 2)
  return [y, m, d].join(separator || '')
}

module.exports = {
  extend: extend,
  isArray: isArray,
  appendStyle: appendStyle,
  getUniqueFromArray: getUniqueFromArray,
  transitionize: transitionize,
  detectWebp: detectWebp,
  getRandom: getRandom,
  getRgb: getRgb,
  loopArray: loopArray,
  leftPad: leftPad,
  getDateStr: getDateStr
}