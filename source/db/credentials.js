const { Pool } = require('pg');

const session = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'josecarlos',
    database: 'bank_server',
    port: '5432'
});

module.exports = {
    session
}; 