  
const pg = require('pg');

const pgConfig = {
    user: 'okayemotions',
    host: '51.210.176.226',
    database: 'okayemotions',
    password: 'Flip12345mass',
    port: 5432,
};
const pool = new pg.Pool(pgConfig);

module.exports = pool;