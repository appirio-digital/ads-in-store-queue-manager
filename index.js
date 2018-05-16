const config = require('config');
const express = require('express');
const winston = require('winston');
const api = require('./api');
const path = require('path');

// Server-wide settings
winston.level = config.WINSTON_LEVEL;
const dev = config.NODE_ENV !== 'production';
const serverRoutes = ['/api'];

// Scaffold the server
async function startServer() {
  const app = await api(express());
  app.use(express.static('build'));
  app.get('*', function(req, res, next) {
    if (serverRoutes.indexOf(req.url) < 0) {
      return res
        .set('Content-Type', 'text/html')
        .sendFile(__dirname + '/build/index.html');
    }
    return next();
  });

  app.listen(config.PORT, err => {
    if (err) throw err;
    winston.info(`> Ready on http://localhost:${config.PORT}`);
  });
}

// Start the server
startServer();
