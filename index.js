'use strict';

var express = require('express');
var path = require('path');
var pg = require('pg');

var createApp = module.exports.app = function(options, client) {
  var app = express();
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('/increment', function(req, res) {
    client.query('update visits set count = count + 1', function(err, result) {
      res.send(result);
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

  pg.connect(settings.dbURL, function(err, client, done) {
    if (err) {
      console.error('Could not connect to database: %s', settings.dbURL);
      process.exit(1);
    }
    createApp(settings, client).listen(settings.port, function() {
      console.log('Express server started on port %s', settings.port);
    });
  });
}
