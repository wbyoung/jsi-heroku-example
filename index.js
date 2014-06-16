'use strict';

var express = require('express');
var path = require('path');
var util = require('util');
var bluebird = require('bluebird'), Promise = bluebird;
var pg = bluebird.promisifyAll(require('pg'));

var createApp = module.exports.app = function(options, client) {
  var app = express();
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('/setup', function(req, res) {
    Promise.resolve()
    .then(function() {
      return client.queryAsync('drop table if exists visits');
    })
    .then(function() {
      return client.queryAsync('create table visits (count int)');
    })
    .then(function() {
      return client.queryAsync('insert into visits (count) values (0)');
    })
    .then(function(result) {
      res.json({ status: 'ok' });
    })
    .catch(function(e) {
      res.send(500, e.toString());
    });
  });
  app.get('/increment', function(req, res) {
    Promise.resolve()
    .then(function() {
      return client.queryAsync('update visits set count = count + 1');
    })
    .then(function() {
      return client.queryAsync('select count from visits limit 1');
    })
    .then(function(result) {
      res.json({ visits: result.rows[0].count });
    })
    .catch(function(e) {
      res.send(500, e.toString());
    });
  });
  return app;
};

if (require.main === module) {
  var settings = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    dbURL: process.env.DATABASE_URL ||
      'postgres://localhost/jsi-heroku-test'
  };

  pg.connectAsync(settings.dbURL).spread(function(client, done) {
    createApp(settings, bluebird.promisifyAll(client))
    .listen(settings.port, function() {
      console.log('Express server started on port %s', settings.port);
    });
  })
  .catch(function() {
    console.error('Could not connect to database: %s', settings.dbURL);
    process.exit(1);
  });
}
