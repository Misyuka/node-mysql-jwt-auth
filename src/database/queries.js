const { DB_NAME } = require('../utils/secrets')

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

const createTableUSers = `
CREATE TABLE IF NOT EXISTS account (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NULL,
    lastname VARCHAR(50) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
)
`;

const createNewUser = `
INSERT INTO account VALUES(null, ?, ?, ?, ?, NOW())
`;

const findUserByEmail = `
SELECT * FROM account WHERE account_email = ?
`;

const findUserById = `
SELECT * FROM account WHERE account_id = ?
`;

module.exports = {
    createDB,
    dropDB,
    createTableUSers,
    createNewUser,
    findUserById,
    findUserByEmail
};
