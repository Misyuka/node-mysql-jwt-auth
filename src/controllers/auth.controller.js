const User = require('../models/user.model');
const { hash: hashPassword, compare: comparePassword } = require('../utils/password');
const { generate: generateToken } = require('../utils/token');

exports.signup = (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = hashPassword(password.trim());

    const user = new User(firstname.trim(), lastname.trim(), email.trim(), hashedPassword);

    User.create(user, (err, data) => {
        if (err) {
            res.status(200).send({
                status: "error",
                message: err.message
            });
        } else {
            const token = generateToken(data.id);
            res.status(200).send({
                status: "success",
                data: {
                    token,
                    data
                }
            });
        }
    });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email.trim(), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(200).send({
                    status: 'error',
                    message: `User with email ${email} was not found`
                });
                return;
            }
            res.status(200).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        if (data) {
            if (comparePassword(password.trim(), data.account_passwd)) {
                const token = generateToken(data.account_id);
                res.status(200).send({
                    status: 'success',
                    data: {
                        token,
                        name: data.account_name,
                        id: data.account_id,
                        email: data.account_email,
                        role: data.account_role
                    }
                });
                return;
            }
            res.status(200).send({
                status: 'error',
                message: 'Incorrect password'
            });
        }
    });

}