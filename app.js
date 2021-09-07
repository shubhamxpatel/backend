var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router()
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin')
var movieRouter = require('./routes/movie')
var searchmovie = require('./routes/searchmovie')
var cors = require('cors')
//var nightupdate = require('./dailyUpdate')
const session = require('express-session');
const MongoStore = require('connect-mongo');


var app = express();

app.use(cors({ origin: ['https://example.com','https://priyanshumohan9849.github.io', 'https://stackoverflow.com', 'https://shubhamxpatel.github.io', 'http://localhost:3000'], credentials: true }))




//app.use(express.static('/public'))
// view engine setup
//app.use((req, res, next) => {

//     res.setHeader('Access-Control-Allow-Origin', '*')
//  res.setHeader('Access-Control-Allow-Credentials')
//  next()
//})
//if (app.get('env') === 'production') {

//}
var sess = {
    secret: 'foo',
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://shubhamp:Kumar@123@cluster0.n5lab.mongodb.net/test?retryWrites=true&w=majority',
        //mongoUrl: 'mongodb://localhost:27017/test',
        ttl: 300 * 60,
        autoRemove: 'native'

    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(new Date().getTime() + 60 * 60 * 1000 * 24), // two weeks
        path: '/'

        //sameSite: 'none',
        //secure: true

    }
}
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
    sess.cookie.sameSite = 'none',
        sess.cookie.httpOnly = true
}
app.use(session(sess));

// app.use((req, res, next) => {
//     app.set('trust proxy', 1) // trust first proxy
//     req.session.cookie.secure = true // serve secure cookies
//     req.session.cookie.sameSite = 'none'
//     next()
// })
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use((req, res, next) => {
    console.log(req.sessionID);
    next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

//app.use(express.static('public/images'));

//app.use(express.static('../movie_suggetion/public'));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ram', router)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/admin', adminRouter)
app.use('/movie', movieRouter)
app.use('/searchmovie', searchmovie)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
