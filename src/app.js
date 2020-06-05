const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const passport = require('passport');
const { ValidationError } = require('express-json-validator-middleware');
const authMiddleware = require('./authorization/auth.middleware');

const indexRouter = require('./routes/index');
const methodsRouter = require('./routes/methods');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout extractScripts', true);
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use('/', indexRouter);
app.use('/methods', authMiddleware, methodsRouter);
app.use('/api', authMiddleware, apiRouter);
app.use('/auth', authRouter);

// Error handler for valication errors
app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        // At this point you can execute your error handling code
        res.status(400).json({ message: 'Invalid JSON schema' });
    } else {
        next(err); // pass error on if not a validation error
    }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'Ошибка' });
});

module.exports = app;
