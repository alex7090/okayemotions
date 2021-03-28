  
const pg = require('pg');

const pgConfig = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
};
const pool = new pg.Pool(pgConfig);

module.exports = pool;