const http = require('http');
const app = require('./app.js');
const server = http.createServer(app);

module.exports = server;