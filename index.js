'use strict';

var lxd = require('./lib/lxd');

lxd.LXD = lxd;
lxd.Client = require('./lib/client');
module.exports = lxd;
