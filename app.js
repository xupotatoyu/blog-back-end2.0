var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');//解析cookies
var logger = require('morgan');//记录日志
//session处理要在路由之前
const session = require('express-session');
const RedisStore=require('connect-redis')(session) //传入session的构造函数


var blogRouter = require('./routes/blog');
var userRouter = require('./routes/user');

var app = express();

// // view engine setup//相关view，无用。有关前端
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

//使用插件
app.use(logger('dev'));//生成日志
app.use(express.json());//getpostdata 运行后直接使用req.body就可以
app.use(express.urlencoded({ extended: false }));//判断数据的格式，兼容其他格式
app.use(cookieParser());//解析cookie

const redisClient = require('./db/redis')//链接对象
const sessionStore = new RedisStore({
  client:redisClient//配置
})

app.use(session({
  secret: '1WJol_8776#',//密匙
  cookie: {   //cookie配置
    path: '/',  //默认配置
    httpOnly:true, //默认配置
    maxAge:24*60*60*1000//设置失效时间 24小时
  },
  store: sessionStore//将session存入redis
}))


app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);


// catch 404 and forward to error handler 检测404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler 抛出程序错误 500
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};//抛出空

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
});
});

module.exports = app;
