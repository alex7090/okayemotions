  
const pg = require('pg');

const pgConfig = {
    user: 'alex',
    host: '51.210.8.156',
    database: 'okayemotions',
    password: 'histoire',
    port: 5432,
};
const pool = new pg.Pool(pgConfig);

module.exports = pool;