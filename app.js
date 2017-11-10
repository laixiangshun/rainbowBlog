/**
 * Created by lailai on 2017/11/6.
 */
var express=require('express');
var ejs=require('ejs');
var bodyParser=require('body-parser');
var session=require('express-session');
var cookieParser=require('cookie-parser');
var mongoose=require('mongoose');

//将路由文件引入
var route=require('./routes/index.js');

//设置端口
var port=process.env.PORT || 3000;

var app=express();

//设置视图的根目录
app.set('views','./views/pages');

//设置视图的模板引擎
app.engine('.html',ejs.__express);
app.set('view engine','html');

//设置静态资源路径
app.use(express.static('./static'));

//解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// 解析 application/json
app.use(bodyParser.json());

//设置session和cookie
app.use(cookieParser());
app.use(session({
    secret: '111',
    name: 'blog',
    resave: false,
    saveUninitialized: true
}));

//监听端口
app.listen(port);

console.log('server is running on '+port);

//链接mongodb
mongoose.Promise=global.Promise;
//var db=mongoose.createConnection('mongodb://127.0.0.1:27017/myblog');
//db.on('open',function(){
//    console.log('connected to mongodb');
//});
mongoose.connection.openUri('mongodb://127.0.0.1:27017/myblog');
mongoose.connection.on('open',function(){
    console.log('connected to mongodb');
});
route(app);