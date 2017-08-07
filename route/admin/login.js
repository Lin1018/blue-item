const express = require('express');
const common = require('../../libs/common.js');
const mysql = require('mysql');

var db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'lin123',
    database:'myItem'
});

module.exports = function(){
    var router = express.Router();

    //login请求
    router.get('/',function(req,res){
        res.render('admin/login.html',{});
    });
    router.post('/',function(req,res){
        var username = req.body.username;
        var password = common.md5(req.body.password+common.MD5_SUFFIX);

        db.query(`SELECT * FROM admin_table WHERE username='${username}'`,function(err,data){
            if(err){
                console.log(err);
                res.status(500).send('database error').end();
            }else{
                if(data.length == 0){
                    res.status(400).send('没有管理员用户').end();
                }else{
                    if(data[0].password == password){
                        //成功
                        req.session['admin_id']=data[0].ID;
                        res.redirect('/admin/');
                    }else{
                        res.status(400).send('密码错误').end();
                    }
                }
            }
        });

    });

    return router;
};
