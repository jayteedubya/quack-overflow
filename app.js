//require('dotenv').config()

const { join } = require('path');
const express = require('express');
const session = require('cookie-session')
const index = require('./routes/index.js');
const api = require('./routes/api.js')
const app = express();
const cors = require('cors');

app.use(session({secret: process.env.TOKEN_SECRET}));
app.use(cors({origin: true, credentials: true, methods: ['GET', 'PUT', 'POST', 'DELETE']}));  //this is all the cors you need. It handles preflights for all route and cors for all routes.
app.use(express.json());
app.use(express.static(join(__dirname, 'build')));
app.use('/', index);
app.use('/api', api);

module.exports = app;