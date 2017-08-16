const express=require('express');
const static=require('express-static');
const bodyParser=require('body-parser');    // 处理表单数据
const multer=require('multer');     // 处理文件数据
const multerObj=multer({dest: './static/upload'});   // 文件存放位置
const mysql=require('mysql');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const consolidate=require('consolidate');

var app=express();
app.listen(3000);
console.log('Server running at port 3000');

//1.获取请求数据
app.use(bodyParser.urlencoded());
app.use(multerObj.any());

//2.cookie、session
app.use(cookieParser());
(function (){
  var keys=[];
  for(var i=0;i<100000;i++){
    keys[i]='a_'+Math.random();
  }
  app.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20*60*1000  //20min
  }));
})();

//3.模板
app.engine('html', consolidate.ejs);
app.set('views', './views');
app.set('view engine', 'html');

//4.route
var admin = require('./route/admin/index.js');

//忽略favicon.ico
app.use(function(req,res,next){
    if(req.url == '/favicon.ico'){
        return;
    }else{
        next();
    }
});

app.use('/', require('./route/web')());
app.use('/admin', admin());

//5.default：static
app.use(static('./static/'));
