'use strict';
const http = require('http');
const router = require('./lib/router');
const server = http.createServer((req, res) => {
  router.route(req, res);
});
server.on('error', (err) => {
  console.error('Server Error', err);
}).on('clientError', (err) => {
  console.error('Client Error', err);
});
const port = 8000;
server.listen(port, () => {
  console.info(`Listening on ${port}`);
});