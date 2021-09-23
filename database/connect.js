require('dotenv').config({path: '../.env'});
const init = {
    noWarnings: false
}
const pg = require('pg-promise')(init);
const monitor = require('pg-monitor');
console.log('from connect js, line 7 ', process.env.DB_CREDENTIALS);
const credentials = JSON.parse(process.env.DB_CREDENTIALS)
const db = pg(credentials);
monitor.attach(init);


module.exports = { pg, db };