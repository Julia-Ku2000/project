const express = require('express');
const router = express.Router();

const { Validator, ValidationError } = require('express-json-validator-middleware');
const validator = new Validator({ allErrors: true }); 
const validate = validator.validate;

const Walda = require('../methods/walda');
const Regret = require('../methods/regret');
const Hurwitz = require('../methods/hurwitz');

const methodsSchema = {
    type: 'object',
    required: ['visitors', 'buyersPercent'],
    properties: {
        visitors: {
            type: 'array'
        },
        buyersPercent: {
            type: 'number',
            items: {
                type: 'number'
            }
        }
    }
};

router.post('/walda', validate({ body: methodsSchema }), (req, res, next) => {
    var { visitors, buyersPercent } = req.body;
    
    const walda = new Walda(visitors, buyersPercent);
    res.json(walda);
});

router.post('/regret', validate({ body: methodsSchema }), (req, res, next) => {
    var { visitors, buyersPercent } = req.body;
    
    const regret = new Regret(visitors, buyersPercent);
    res.json(regret);
});

router.post('/hurwitz', validate({ body: methodsSchema }), (req, res, next) => {
    let { visitors, buyersPercent } = req.body;
    
    const hurwitz = new Hurwitz(visitors, buyersPercent);
    res.json(hurwitz);
}); 

module.exports = router;
