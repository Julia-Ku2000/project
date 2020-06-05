const encryption = require('../../authorization/encryption');

module.exports = (sequelize, DataTypes) => {

    var User = sequelize.define('User', {
        login: {
            type: DataTypes.STRING,
            required: true
        },
        password: {
            type: DataTypes.STRING,
            required: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true, 
            required: true,
            validate: {
                isEmail: true
            }
        }
    });

    User.associate = (models) => {};

    User.beforeCreate((user, options) => {
        user.password = encryption().generatePasswordHash(user);
    });

    return User;
};