const { join } = require('path');
const express = require('express');
const session = require('cookie-session')
const index = require('./routes/index.js');
const api = require('./routes/api.js')
const app = express();

app.use(session({secret: process.env.TOKEN_SECRET}));
app.use(express.json());
app.use(express.static(join(__dirname, 'build')));
app.use('/', index);
app.use('/api', api);

module.exports = app;