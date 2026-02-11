var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose= require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var indexRouter = require('./routes/index');
var pricesRouter = require('./routes/prices')
var centersRouter = require('./routes/centers');
var signupRouter = require('./routes/signup');

require('./config/passport')(passport);

var app = express();
//connect to database
var mongoDB = 'mongodb://Mehdi:DatabaseMehdy!123@cluster0-shard-00-00-lnhl4.mongodb.net:27017,cluster0-shard-00-01-lnhl4.mongodb.net:27017,cluster0-shard-00-02-lnhl4.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
mongoose.connect(
  mongoDB)
  .then(() => console.log("MongoDb connected"))
  .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/prices', pricesRouter);
app.use('/centers', centersRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);


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
