const init = {
    noWarnings: false
}
const pg = require('pg-promise')(init);
const credentials = {connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }};
const db = pg(credentials);


module.exports = { pg, db };