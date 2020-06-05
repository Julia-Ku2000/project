const express = require('express');
const router = express.Router();

const constants = require('../methods/constants');

router.get('/', (req, res, next) => {
    res.render('methods', Object.assign({ title: 'Методы' }, constants));
});

module.exports = router;