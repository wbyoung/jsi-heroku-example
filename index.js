'use strict';

var express = require('express');
var path = require('path');

var run = module.exports = function(env) {
  var app = express();
  app.use(express.static(path.join(__dirname, 'public')));
  return app;
};

if (require.main === module) {
  var env = process.env.NODE_ENV || 'development';
  var port = process.env.PORT || 3000;

  run(env).listen(port, function() {
    console.log('Express server started on port %s', port);
  });
}
