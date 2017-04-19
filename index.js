'use strict';

var path = require('path');
var cp = require("child_process");

module.exports = function(dir) {
  var cwd = dir ? path.resolve(dir) : process.cwd();

  function addRemote(name, url, cb) {
    if (typeof cb !== 'function') {
      throw new TypeError('expected callback to be a function');
    }
    if (typeof url !== 'string') {
      cb(new TypeError('expected url to be a string'));
      return;
    }
    if (typeof name !== 'string') {
      cb(new TypeError('expected name to be a string'));
      return;
    }
    cp.exec('git remote add ' + name + ' ' + url, {cwd: cwd}, cb);
  };

  addRemote.sync = function(name, url) {
    if (typeof url !== 'string') {
      throw new TypeError('expected url to be a string');
    }
    if (typeof name !== 'string') {
      throw new TypeError('expected name to be a string');
    }
    cp.execSync('git remote add ' + name + ' ' + url, {cwd: cwd});
  };

  return addRemote;
};
