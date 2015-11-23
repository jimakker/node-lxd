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

  // Joi.assert(options, {
  //   uri: Joi.string().uri({
  //     scheme: ['http', 'https']
  //   }).regex(/\/$/).required(),
  //   client: Joi.object().required()
  // });

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

LXD.prototype.getApis = bluebird.method(function() {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri(),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getServerInfo = bluebird.method(function() {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0'),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.updateServerInfo = bluebird.method(function(json) {
  return this._options.client.request({
    method: 'PUT',
    url: this._genUri('1.0'),
    json: json
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getImages = bluebird.method(function() {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/images'),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getImage = bluebird.method(function(fingerprint) {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/images/' + fingerprint),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});


LXD.prototype.createImage = bluebird.method(function(json) {
  return this._options.client.request({
    method: 'POST',
    url: this._genUri('1.0/images'),
    json: json
  }).spread(function(res, body) {
    return body;
  });
});


LXD.prototype.deleteImage = bluebird.method(function(fingerprint) {
  return this._options.client.request({
    method: 'DELETE',
    url: this._genUri('1.0/images/' + fingerprint),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getContainers = bluebird.method(function() {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/containers'),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.createContainer = bluebird.method(function(json) {
  return this._options.client.request({
    method: 'POST',
    url: this._genUri('1.0/containers'),
    json: json
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getContainer = bluebird.method(function(name, options) {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/containers/' + name, options),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.updateContainer = bluebird.method(function(name, json) {
  return this._options.client.request({
    method: 'PUT',
    url: this._genUri('1.0/containers/' + name),
    json: json
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.renameContainer = bluebird.method(function(name, json) {
  return this._options.client.request({
    method: 'POST',
    url: this._genUri('1.0/containers/' + name),
    json: json
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.deleteContainer = bluebird.method(function(name) {
  return this._options.client.request({
    method: 'DELETE',
    url: this._genUri('1.0/containers/' + name),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getContainerLogs = bluebird.method(function(name, options) {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/containers/' + name + '/logs', options),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getContainerLogFile = bluebird.method(function(name, options) {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/containers/' + name + '/logs/' + options.logFile),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.deleteContainerLogFile = bluebird.method(function(name, options) {
  return this._options.client.request({
    method: 'DELETE',
    url: this._genUri('1.0/containers/' + name + '/logs/' + options.logFile),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});


LXD.prototype.setContainerState = bluebird.method(function(name, json) {
  return this._options.client.request({
    method: 'PUT',
    url: this._genUri('1.0/containers/' + name + '/state'),
    json: json
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.waitOperation = bluebird.method(function(op, options) {
  if (typeof op === 'object')
    op = op.operation;

  var uuid = op.split('/').pop();
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/operations/' + uuid + '/wait', options),
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getOperations = bluebird.method(function(options) {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/operations/', options),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getOperation = bluebird.method(function(op) {
  if (typeof op === 'object')
    op = op.operation;

  var uuid = op.split('/').pop();
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/operations/' + uuid),
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.subscribeToEvents = bluebird.method(function() {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/events/'),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getProfiles = bluebird.method(function() {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/profiles'),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getProfile = bluebird.method(function(profile) {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/profiles/'+ profile),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getNetworks = bluebird.method(function() {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/networks'),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});

LXD.prototype.getNetwork = bluebird.method(function(network) {
  return this._options.client.request({
    method: 'GET',
    url: this._genUri('1.0/profiles/'+ network),
    json: true
  }).spread(function(res, body) {
    return body;
  });
});


LXD.prototype.exec = bluebird.method(function(name, json) {
  return this._options.client.request({
    method: 'POST',
    url: this._genUri('1.0/containers/' + name + '/exec'),
    json: json
  }).spread(function(res, body) {
    return body;
  });
});

module.exports = LXD;
