'use strict';

var request = require('request');
var bluebird = require('bluebird');
var mout = require('mout');

var Client = function(options) {
  if (!(this instanceof Client))
    return new Client(options);

  this._options = mout.lang.deepClone(options);
};

Client.prototype.engine = function() {
  return request.defaults(this._options);
};

Client.prototype.request = function(options) {
  var that = this;
  return new bluebird.Promise(function(resolve, reject) {
    var engine = that.engine();
    engine(options, function(err, res, body) {
      if (err)
        return reject(err);

      resolve([res, body]);
    });
  });
};

module.exports = Client;
