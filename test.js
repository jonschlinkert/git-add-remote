'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var del = require('delete');
var gfc = require('gfc');
var remotes = require('list-git-remotes');
var addRemote = require('./');
var fixtures = path.join.bind(path, 'fixtures');

describe('git-add-remote', function() {
  describe('main export', function() {
    it('should export a function', function() {
      assert.equal(typeof addRemote, 'function');
    });

    it('should expose a "sync" method', function() {
      assert.equal(typeof addRemote().sync, 'function');
    });
  });

  describe('async', function() {
    it('should throw an error when callback is missing', function() {
      assert.throws(function() {
        addRemote()('foo', 'bar');
      }, /expected callback to be a function/);
    });

    it('should throw an error when url is missing', function(cb) {
      addRemote()('foo', null, function(err) {
        assert(err);
        assert(/expected url/.test(err.message));
        cb();
      });
    });

    it('should throw an error when name is missing', function(cb) {
      addRemote()(null, 'foo', function(err) {
        assert(err);
        assert(/expected name/.test(err.message));
        cb();
      });
    });

    it('should add a remote', function(cb) {
      del.sync(fixtures());
      gfc(fixtures(), function(err) {
        if (err) {
          cb(err);
          return;
        }

        var remote = addRemote(fixtures());
        remote('foo', 'https://github/foo/foo.git', function(err) {
          if (err) {
            cb(err);
            return;
          }

          var obj = remotes.sync(fixtures());
          assert(obj.hasOwnProperty('foo'));
          assert.equal(obj.foo, 'https://github/foo/foo.git');

          del.sync(fixtures());
          cb();
        });
      });
    });
  });

  describe('sync', function() {
    it('should throw an error when url is missing', function() {
      if (process.version === 'v0.10.0') {
        this.skip();
        return;
      }

      assert.throws(function() {
        addRemote().sync('foo', null);
      }, /expected url/);
    });

    it('should throw an error when name is missing', function() {
      if (process.version === 'v0.10.0') {
        this.skip();
        return;
      }

      assert.throws(function() {
        addRemote().sync(null, 'foo');
      }, /expected name/);
    });

    it('should add a remote', function(cb) {
      if (process.version === 'v0.10.0') {
        this.skip();
        return;
      }

      del.sync(fixtures());
      gfc(fixtures(), function(err) {
        if (err) {
          cb(err);
          return;
        }

        var remote = addRemote(fixtures());
        remote.sync('foo', 'https://github/foo/foo.git');
        var obj = remotes.sync(fixtures());
        assert(obj.hasOwnProperty('foo'));
        assert.equal(obj.foo, 'https://github/foo/foo.git');
        del.sync(fixtures());
        cb();
      });
    });
  });
});
