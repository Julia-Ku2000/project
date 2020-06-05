const encryption = require('./encryption');
const User = require('../database/models').User;

module.exports = (passport) => {
    function login() {
        const LocalStrategy = require('passport-local').Strategy;

        passport.use(
            new LocalStrategy({ 
                usernameField: 'email', 
                passwordField: 'password'
            }, 
            (email, password, done) => {
                User.findOne({ where: { email } })
                    .then((user) => {
                        if (!user) {
                            return done(null, false, { message: 'Incorrect email.' });
                        }
        
                        if (!encryption().comparePassword(password, user.password)) {
                            return done(null, false, { message: 'Incorrect password.' });
                        }

                        return done(null, user);
                    }).catch((err) => {
                        console.log(err);
                        return done(err);
                    });
            })
        );
    };

    function logout(req, res) {
        req.logout();
        res.redirect('/');
    };

    function serialize() {
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });
    };

    function deserialize() {
        passport.deserializeUser((id, done) => {
            User.findById(id)
                .then((user) => {
                    done(null, user);
                }).catch((err) => {
                    console.log(err);
                    return done(err);
                });;
        });        
    };

    return {
        login,
        logout,
        serialize,
        deserialize
    };
};