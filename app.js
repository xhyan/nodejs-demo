// 加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 创建项目实例
var app = express();
//加载配置
var settings = require('./setting');
var flash = require('connect-flash');
//连接到数据库
var MongoStore = require('connect-mongo')(session);
//设置session
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//cookie有效期，30天
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port
    })
}));

// 加载路由控制
var login = require('./routes/login');
//var users = require('./routes/users');
//var partner = require('./routes/partner');

// view engine setup
// 定义EJS模板引擎和模板文件位置，也可以使用jade或其他模型引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

// uncomment after placing your favicon in /public
// 定义icon图标
// app.use(favicon(__dirname + '/public/favicon.ico'))
// 定义日志和输出级别
app.use(logger('dev'));
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// 定义cookie解析器
app.use(cookieParser());
// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
// 匹配路径和路由
app.use('/', login);
//app.use('/users', users);
//app.user('/partner', partner);
// 404错误处理
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers
// development error handler
// will print stacktrace
// 开发环境，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
// 生产环境，500错误处理
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// 输出模型app
module.exports = app;
