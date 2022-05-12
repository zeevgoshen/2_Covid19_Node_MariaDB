const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

console.log({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

// Connect and check for errors
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Databse connection lost');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Databse has too many connection');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Databse connection was refused');
        }
    }
    if (connection) {
        connection.release();
    }
    return;
});

module.exports = pool;