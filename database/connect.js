require('dotenv').config();
const init = {
    noWarnings: false
}
const pg = require('pg-promise')(init);
const monitor = require('pg-monitor');
const credentials = JSON.parse(process.env.DB_CREDENTIALS)
const db = pg(credentials);
//monitor.attach(init);


module.exports = { pg, db };