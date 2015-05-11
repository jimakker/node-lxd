'use strict';

var Client = require('./client');
var url = require('url');
var bluebird = require('bluebird');
var mout = require('mout');
var Joi = require('joi');
var querystring = require('querystring');

var LXD = function(options) {
  if (!(this instanceof LXD))
    return new LXD(options);

  Joi.assert(options, {
    uri: Joi.string().uri({
      scheme: ['http', 'https']
    }).regex(/\/$/).required(),
    client: Joi.object().required()
  });

  if (options.client.constructor === Object)
    options.client = new Client(options.client);

  this._options = mout.lang.deepClone(options);
};

LXD.prototype._genUri = function(path, query) {
  if (query)
    query = querystring.stringify(query);

  return url.resolve(this._options.uri, path || '') +
    (query ? '?' + query : '');
};

LXD.prototype._promisify = function(func) {
  return new bluebird.Promise(func.bind(this));
};

LXD.prototype.getApis = function() {
  return this._promisify(function(resolve, reject) {
    this._options.client.request({
      method: 'GET',
      url: this._genUri(),
      json: true
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

LXD.prototype.getApis = function() {
  return this._promisify(function(resolve, reject) {
    this._options.client.request({
      method: 'GET',
      url: this._genUri(),
      json: true
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

LXD.prototype.getServerInfo = function() {
  return this._promisify(function(resolve, reject) {
    this._options.client.request({
      method: 'GET',
      url: this._genUri('1.0'),
      json: true
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

LXD.prototype.updateServerInfo = function(json) {
  return this._promisify(function(resolve, reject) {
    this._options.client.request({
      method: 'PUT',
      url: this._genUri('1.0'),
      json: json
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

LXD.prototype.getContainers = function() {
  return this._promisify(function(resolve, reject) {
    this._options.client.request({
      method: 'GET',
      url: this._genUri('1.0/containers'),
      json: true
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

LXD.prototype.createContainer = function(json) {
  return this._promisify(function(resolve, reject) {
    this._options.client.request({
      method: 'POST',
      url: this._genUri('1.0/containers'),
      json: json
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

LXD.prototype.getContainer = function(name, options) {
  return this._promisify(function(resolve, reject) {
    this._options.client.request({
      method: 'GET',
      url: this._genUri('1.0/containers/' + name, options),
      json: true
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

LXD.prototype.updateContainer = function(name, json) {
  return this._promisify(function(resolve, reject) {
    this._options.client.request({
      method: 'PUT',
      url: this._genUri('1.0/containers/' + name),
      json: json
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

LXD.prototype.renameContainer = function(name, json) {
  return this._promisify(function(resolve, reject) {
    this._options.client.request({
      method: 'POST',
      url: this._genUri('1.0/containers/' + name),
      json: json
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

LXD.prototype.waitOperation = function(op, options) {
  return this._promisify(function(resolve, reject) {
    if (typeof op === 'object')
      op = op.operation;

    var uuid = op.split('/').pop();
    this._options.client.request({
      method: 'GET',
      url: this._genUri('1.0/operations/' + uuid + '/wait', options),
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

LXD.prototype.getOperation = function(op) {
  return this._promisify(function(resolve, reject) {
    if (typeof op === 'object')
      op = op.operation;

    var uuid = op.split('/').pop();
    this._options.client.request({
      method: 'GET',
      url: this._genUri('1.0/operations/' + uuid),
    }).spread(function(res, body) {
      resolve(body);
    }).catch(function(err) {
      reject(err);
    });
  });
};

module.exports = LXD;
