let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');//cookie
const proxy = require('express-http-proxy');
// var history = require('connect-history-api-fallback');
let app = express();

/* 允许跨域 ，开发环境可以把它允许跨域*/
if(process.env.NODE_ENV == 'development'){
	app.all('*', function(req, res, next) {  
	    res.header("Access-Control-Allow-Origin", "*");  
	    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");  
	    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	    next();  
	});
}

// app.set('views', path.join(__dirname, '../dist'));	// 页面目录
// app.engine('html', ejs.__express);	// 模板引擎
// app.set('view engine', 'html');
app.use(cookieParser());

// 反代文件上传时有问题，判断是否为文件上传
const isMulti = req => req.headers['content-type'] && req.headers['content-type'].indexOf('multipart') > -1;
const middle = () => (req, res, next) => {
    if(isMulti(req)) {
        return next();
    }
    return bodyParser.urlencoded({extended: false})(req, res, next);
}
const middle2 = () => (req, res, next) => {
    if(isMulti(req)) {
        return next();
    }
    return bodyParser.json()(req, res, next);
}
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));	
// 用于提交表单
app.use(middle());
app.use(middle2());

//安全检查接口
app.get('/health_check', function (req, res) {
  res.status(200).send({code: 0, data: 'data', msg: 'success'});
})

//解决单页面刷新问题，将指向单页面的资源入口
// app.use(history({
// 	rewrites: [
// 	    { from: /^\/list\/$/, to: '/' }
// 	  ],
// //	htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
// }));

app.use(express.static(path.join(__dirname, '../dist'))); // 静态文件目录

// 服务代理
app.use('/api', proxy("http://bi.teweit.com", {
    proxyReqPathResolver: function (req) {
        return req.url;
      }
}));


let port = 3000;
app.listen(port, function () {
    console.log('server start on port ' + port)
	// logger.info('server start on port ' + port);
});

module.exports = app;