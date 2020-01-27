'use strict';
const handler = require('./requestHandler');

function route(req, res) {
  let address = req.url
  let data = '';
  if (req.url.startsWith('/qrcode_request')) {
    address = '/' + req.url.split('/')[1];
    data = req.url.split('/')[2];
  }
  switch (address) {
    case '/public/stylesheets/style.css':
      handler.handleStyleSheet(req, res);
      break;
    case '/public/javascripts/bundle.js':
      handler.handleJavascript(req, res);
      break;
    case '/qrcode_request':
      handler.handleQrcodeRequest(req, res, data);
      break;
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