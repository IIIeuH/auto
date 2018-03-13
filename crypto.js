const bcrypt = require('bcrypt'),
    saltRounds = 10;

exports.encrypt = (password) => {
    return bcrypt.hashSync(password, saltRounds);
};

exports.decrypt = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};