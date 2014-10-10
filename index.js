'use strict';

var express = require('express');
var path = require('path');
var util = require('util');
var bluebird = require('bluebird'), Promise = bluebird;
var pg = bluebird.promisifyAll(require('pg'));

var createApp = module.exports.app = function(options, client) {
  var app = express();
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(require('body-parser')());

  /**
   * GET /api/setup
   * Setup order system
   *
   * Example response:
   *
   *     { "status": "ok" }
   */
  app.get('/api/setup', function(req, res) {
    Promise.resolve()
    .then(function() {
      return client.queryAsync('create table if not exists ' +
        'orders (id serial primary key, name varchar(255))');
    })
    .then(function(result) {
      res.json({ status: 'ok' });
    })
    .catch(function(e) {
      res.send(500, e.toString());
    });
  });

  /**
   * GET /api/orders
   * List orders
   *
   * Example response:
   *
   *     {
   *       orders: [
   *         { "id": 1, "name": "Whitney Young" },
   *         { "id": 4, "name": "John Doe" }
   *       ]
   *     }
   */
  app.get('/api/orders', function(req, res) {
    Promise.resolve()
    .then(function() {
      return client.queryAsync('select * from orders');
    })
    .then(function(result) {
      res.json(result.rows);
    })
    .catch(function(e) {
      res.send(500, e.toString());
    });
  });

  /**
   * POST /api/orders
   * Create an order
   *
   * Example response:
   *
   *     { "id": 3, "name": "Jennifer Smith" }
   */
  app.post('/api/orders', function(req, res) {
    var name = req.body.name;
    Promise.resolve()
    .then(function() {
      return client.queryAsync(
        'insert into orders (name) values ($1::varchar)', [name]);
    })
    .then(function() {
      return client.queryAsync('select lastval()');
    })
    .then(function(result) {
      res.json({
        id: result.rows[0].lastval,
        name: name
      });
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
      'postgres://localhost/jsi_heroku_test'
  };

  pg.connectAsync(settings.dbURL).spread(function(client, done) {
    createApp(settings, bluebird.promisifyAll(client))
    .listen(settings.port, function() {
      console.log('Express server started on port %s', settings.port);
    });
  })
  .catch(function(e) {
    console.log(e);
    console.error('Could not connect to database: %s', settings.dbURL);
    process.exit(1);
  });
}
