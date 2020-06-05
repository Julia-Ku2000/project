const bcrypt = require('bcrypt-nodejs');

function Encryption() {
    function generatePasswordHash(user) {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(user.password, salt);

        return hash;
    };

    function comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    };

    return {
        generatePasswordHash,
        comparePassword,
    };
};

module.exports = Encryption;