const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../authorization/auth.controller')(passport);

const { Validator, ValidationError } = require('express-json-validator-middleware');
const validator = new Validator({ allErrors: true }); 
const validate = validator.validate;

const userSchema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        }
    }
};

router.post(
    '/login', 
    validate({ body: userSchema }), 
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) { 
                return next(err); 
            }

            if (!user) { 
                return res.status(400).json({ message: info.message });
            }

            req.logIn(user, (err) => {
                if (err) { 
                    return next(err);
                }

                return res.redirect('/');
            });
        })(req, res, next);   
    }
);

router.get('/logout', AuthController.logout);

AuthController.login();
AuthController.serialize();
AuthController.deserialize();

module.exports = router;