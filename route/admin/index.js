const express = require('express');

module.exports = function(){
    var router = express.Router();

    //检查登陆状态
    router.use(function(req,res,next){
        if(!req.session['admin_id'] && req.url!='/login'){ //没有登陆
            res.redirect('/admin/login');
        }else{
            next();
        }
    });

    router.get('/',function(req,res){
        res.render('admin/index.html');
    });

    //banner请求
    router.use('/banner', require('./banner.js')());

    //login请求
    router.use('/login', require('./login.js')());

    router.use('/custom',require('./custom.js')());

    return router;
};


