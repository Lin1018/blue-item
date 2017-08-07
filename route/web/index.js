const express = require('express');
const mysql = require('mysql');

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'lin123',
    database:'myItem'
});

module.exports = function(){
    var router = express.Router();

    router.get('/get_banners',function(req,res){
        db.query(`SELECT * FROM banner_table`,function(err,data){
            if(err){
                res.status(500).send('database error').end();
            }else{
                res.send(data).end();
            }
        });
    });

    router.get('/get_custom_evaluations',function(req,res){
        db.query(`SELECT * FROM custom_evaluation_table`,function(err,data){
            if(err){
                res.status(500).send('database error').end();
            }else{
                res.send(data);
            }
        });
    });


    return router;
};
