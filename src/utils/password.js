const bcrypt = require('bcryptjs');

const hash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const compare = (password, hashedPassword) => { 
    console.log(password, hashedPassword);
    hashedPassword = hashedPassword.replace('$2y$', '$2a$');
    return bcrypt.compareSync(password, hashedPassword)
}

module.exports = {
    hash,
    compare
}