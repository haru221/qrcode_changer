'use strict';
const handler = require('./requestHandler');

function route(req, res) {
  switch (req.url) {
    case '/qrcode_changer':
      handler.handleRequest(req, res);
      break;
    case '/favicon.ico':
      handler.handleFavicon(req, res);
      break;
    default:
      handler.handleNotFound(req, res);
      break;
  }
}

module.exports = {
  route
};