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
var cors = require('cors')
var nightupdate = require('./dailyUpdate')
const session = require('express-session');
const MongoStore = require('connect-mongo');
setInterval(() => {
    console.log(new Date().getHours())
    if (new Date().getHours() === 1) {
        nightupdate()
    }
}, 60 * 60 * 1000);

var app = express();

app.use(cors({ origin: ['https://example.com', 'https://stackoverflow.com', 'https://shubhamxpatel.github.io', 'http://localhost:3000'], credentials: true }))
app.use(session({
    secret: 'foo',
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/test',
        ttl: 300 * 60,
        autoRemove: 'native'

    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60, // two weeks
        SameSite = 'none'
    }
}));

//app.use(express.static('/public'))
// view engine setup
//app.use((req, res, next) => {

//     res.setHeader('Access-Control-Allow-Origin', '*')
//  res.setHeader('Access-Control-Allow-Credentials')
//  next()
//})
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
router.get('/', (req, res, next) => {
    res.sendFile("public/help.html", { root: path.join(__dirname) })
})

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