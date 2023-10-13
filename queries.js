const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movies_db',
    password: 'admin123',
    port: 5432,
});

module.exports = pool;