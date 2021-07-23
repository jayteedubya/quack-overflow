require('dotenv').config();
const pg = require('pg-promise')();
const credentials = JSON.parse(process.env.DB_CREDENTIALS)
const connection = pg(credentials);

module.exports = connection;