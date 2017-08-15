var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// routes
var index = require('./routes/index');
var users = require('./routes/users');
// 引入
const Goods = require('./routes/goods')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 所有访问都走这个逻辑
app.use( function(req, res, next){
  if(req.cookies.userId){
    next()
  } else {
    if(req.originalUrl == '/users/login'
      || req.originalUrl == '/users/logout'
      // || req.originalUrl == '/users/cartList'
      || req.path == '/goods/list'){
      next()
    } else{
      res.json({
        status: '1',
        msg: '当前未登录',
        result: ''
      })
    }
  }
})

app.use('/', index);
app.use('/users', users);

// 添加
app.use('/goods', Goods)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
