var path = require('path'); //path模块可以帮你规范化连接和解析路径，还可以用于绝对路径到对路径的转换、提取路径的组成部分及判断路径是否存在等
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite')(__dirname);
var routes = require('./routes');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
//session 中间件
app.use(session({
  name: config.session.key, //设置cookie中保存session id的字段名称
  secret: config.session.secret, //通过设置secret来计算hash值并放在cookie中，使产生的signedCookie防篡改
  resave: true, //强制更新session
  saveUninitialized: false, //设置为false，强制创建一个session，即使用户未登陆
  cookie: {
    maxAge: config.session.maxAge //过期时间，过期后cookie中的session id自动删除
  },
  store: new MongoStore({
    url: config.mongodb //mongodb地址
  })
}));

//flash 中间件，用来显示通知
app.use(flash());

//处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));

//设置模版全局常量
app.locals.yicunyipin = {
  title: pkg.name,
  description: pkg.description
};

//添加模版所需要的三个变量，在此处定义之后，可以在模版中使用
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));

//路由
routes(app);

// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

// error page
app.use(function (err, req, res, next) {
  res.render('error', {
    error: err
  });
});

if (module.parent) { //直接启动index.js则会监听端口启动程序，如果index.js被require了，则导出app，通常用于测试。
  module.exports = app;
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
  });
}