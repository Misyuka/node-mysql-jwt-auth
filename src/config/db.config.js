const mysql = require('mysql');
const { logger } = require('../utils/logger');
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require('../utils/secrets');

var connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

connection.connect((err) => {
    if (err) logger.error(err.message);
    else logger.info('Database connected')
});

function handleDisconnect() {
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            connection = mysql.createConnection({
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASS,
                database: DB_NAME
            });
            
            connection.connect((err) => {
                if (err) logger.error(err.message);
                else logger.info('Database connected')
            });
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = connection;