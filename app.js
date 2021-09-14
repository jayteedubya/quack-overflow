require('dotenv').config()

const { join } = require('path');
const express = require('express');
const session = require('cookie-session')
const index = require('./routes/index.js');
const api = require('./routes/api.js')
const app = express();
const cors = require('cors');

app.use(cors())
app.use(session({secret: process.env.TOKEN_SECRET}));
app.use(express.json());
app.use('/public', express.static(join(__dirname, 'public')));
app.use('/', index);
app.use('/api', api)

module.exports = app;