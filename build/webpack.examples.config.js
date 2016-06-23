var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var loader = require('weex-loader');

var entry = {};

function walk(dir) {
  dir = dir || '.'
  var directory = path.join(__dirname, '../examples', dir);
  fs.readdirSync(directory)
    .forEach(function(file) {
      var fullpath = path.join(directory, file);
      var stat = fs.statSync(fullpath);
      var extname = path.extname(fullpath);
      if (stat.isFile() && extname === '.we') {
        var name = path.join('examples', 'build', dir, path.basename(file, extname));
        entry[name] = fullpath + '?entry=true';
      } else if (stat.isDirectory() && file !== 'build' && file !== 'include') {
        var subdir = path.join(dir, file);
        walk(subdir);
      }
    });
}

walk();

module.exports = {
  entry: entry,
  output : {
    path: '.',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.we(\?[^?]+)?$/,
        loader: 'weex'
      },
      {
        test: /\.js(\?[^?]+)?$/,
        loader: 'weex?type=script'
      },
      {
        test: /\.css(\?[^?]+)?$/,
        loader: 'weex?type=style'
      }, 
      {
        test: /\.html(\?[^?]+)?$/,
        loader: 'weex?type=tpl'
      }
    ]
  }
}
