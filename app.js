const express = require('express');
const index = require('./routes/index.js');
const api = require('./routes/api.js')
const app = express();

app.use('/', index);
app.use('/api', api)

module.exports = app;