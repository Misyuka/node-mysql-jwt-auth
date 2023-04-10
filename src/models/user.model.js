const db = require('../config/db.config');
const { createNewUser: createNewUserQuery, findUserByEmail: findUserByEmailQuery, findUserById: findUserByIdQuery  } = require('../database/queries');
const { logger } = require('../utils/logger');

class User {
    constructor(id, role, name, email, password, verified, first_name, last_name, gender, enabled) {
        this.id = id;
        this.role = role;
        this.name = name;
        this.email = email;
        this.password = password;
        this.verified = verified;
        this.first_name = first_name;
        this.last_name = last_name;
        this.gender = gender;
        this.enabled = enabled;
    }

    static create(newUser, cb) {
        db.query(createNewUserQuery, 
            [
                newUser.firstname, 
                newUser.lastname, 
                newUser.email, 
                newUser.password
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    email: newUser.email
                });
        });
    }

    static findByEmail(email, cb) {
        db.query(findUserByEmailQuery, email, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.length) {
                cb(null, res[0]);
                return;
            }
            cb({ kind: "not_found" }, null);
        })
    }

    
    static findById(id, cb) {
        db.query(findUserByIdQuery, id, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.length) {
                cb(null, res[0]);
                return;
            }
            cb({ kind: "not_found" }, null);
        })
    }
}

module.exports = User;