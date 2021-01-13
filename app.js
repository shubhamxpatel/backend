var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router=express.Router()
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');


var app = express();

app.use(express.static('/public'))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
/*app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods" , "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  req.header('Access-Control-Allow-Origin', '*');
 
  next();
});*/

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
app.use('/ram',router)
app.use('/login',loginRouter)
app.use('/register',registerRouter)

router.get('/',(req,res,next)=>{
  res.sendFile("public/help.html",{root:path.join(__dirname)})
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
