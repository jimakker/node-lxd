'use strict';

var expect = require('chai').expect;
var config = process.env;
var client = null;
var fs = require('fs');
var lxd = require('../');
var container = 'lxd-test-' + new Date().getTime();

describe('Main LXD Api endpoints', function() {

  beforeEach(function() {
    client = new lxd.LXD({
      uri: config.LXD_URI,
      client: {
        strictSSL: false,
        agentOptions: {
          cert: fs.readFileSync(config.LXD_CERT),
          key: fs.readFileSync(config.LXD_KEY)
        }
      }
    });
  });

  describe('Server info', function() {

    it('Should return available APIs', function() {
      return client.getApis().then(function(res) {
        expect(res.status).to.be.equal('Success');
        expect(res.metadata).to.contain('/1.0');
      });
    });

    it('Should return server info', function() {
      return client.getServerInfo().then(function(res) {
        expect(res.status).to.be.equal('Success');
        expect(res.metadata.environment.driver).to.be.equal('lxc');
      });
    });

    it('Should update server info', function() {
      return client.updateServerInfo({
        config: {
          'trust-password': false
        }
      }).then(function(res) {
        expect(res.status).to.be.equal('Success');
      });
    });

  });

  describe('Container manipulation', function() {

    it('Should create a container', function() {
      return client.createContainer({
        name: container,
        architecture: 'x86_64',
        profiles: ['default'],
        source: {
          type: 'image',
          alias: 'ubuntu'
        }
      }).then(function(res) {
        expect(res.status).to.be.equal('OK');

        return client.waitOperation(res);
      });
    });

    it('Should list containers', function() {
      return client.getContainers().then(function(res) {
        expect(res.status).to.be.equal('Success');
        expect(res.metadata).to.contain('/1.0/containers/' + container);
      });
    });

    it('Should get a container\'s infos', function() {
      return client.getContainer(container).then(function(res) {
        expect(res.status).to.be.equal('Success');
        expect(res.metadata.name).to.be.equal(container);
      });
    });

    it('Should update a container', function() {
      return client.updateContainer(container, {
        config: {
          'resources.cpus': '1'
        }
      }).then(function(res) {
        expect(res.status).to.be.equal('OK');

        return client.waitOperation(res);
      });
    });

    it('Should rename a container', function() {
      return client.updateContainer(container, {
        name: container + '-new'
      }).then(function(res) {
        expect(res.status).to.be.equal('OK');

        return client.waitOperation(res);
      }).then(function(res){
        console.log(res);
      });
    });

  });


});
