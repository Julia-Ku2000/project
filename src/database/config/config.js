const path = require('path');

module.exports = {
    development: {
        username: 'root',
        password: 'dev',
        database: 'theaterDB_dev',
        host: '127.0.0.1',
        dialect: 'sqlite',
        storage: path.join(process.cwd(), 'data', 'db.sqlite')
    },
    test: {
        username: 'root',
        password: 'test',
        database: 'theaterDB_test',
        host: '127.0.0.1',
        dialect: 'sqlite',
        storage: path.join(process.cwd(), 'data', 'db.sqlite')
    },
    production: {
        username: 'root',
        password: 'prod',
        database: 'theaterDB_prod',
        host: '127.0.0.1',
        dialect: 'sqlite',
        storage: path.join(process.cwd(), 'data', 'db.sqlite')
    }
};