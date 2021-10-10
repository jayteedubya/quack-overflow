require('dotenv').config();
const init = {
    noWarnings: false
}
const pg = require('pg-promise')(init);
const monitor = require('pg-monitor');
const credentials = {connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }};
const db = pg(credentials);
monitor.attach(init);


module.exports = { pg, db };