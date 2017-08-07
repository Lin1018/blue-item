const express = require('express');
const mysql = require('mysql');
const async = require('async');

var db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'lin123',
    database:'myItem'
});

module.exports = function(){
    var router = express.Router();

    //banner请求
    router.get('/',function(req,res){

    var sqls = {
        'selectId': `SELECT * FROM banner_table WHERE id='${req.query.id}'`,
        'selectAll': `SELECT * FROM banner_table`
    }
    var tasks = ['selectId', 'selectAll'];
        //修改banner数据
        switch(req.query.act){
            case 'mod':
                db.query(`SELECT * FROM banner_table WHERE id='${req.query.id}'`,function(err,data){
                    if(err){
                        console.log(err);
                        res.status(500).send('database err').end();
                    }else{
                        if(data.length==0){
                            res.status(404).send('Data not found').end();
                        }else{
                               db.query(`SELECT * FROM banner_table`,function(err,banner_data){
                                if(err){
                                    console.log(err);
                                    res.status(500).send('database error').end();
                                }else{
                                    res.render('admin/banner.html',{banner_data, mod_data:data[0]} );
                                }
                            });
                        }
                    }
                });
                // async.eachSeries(tasks, function(item,data){
                //     db.query(sqls[item], function(err,data){
                //         res.render('admin/banner.html',{banner_data, mod_data:data[0]} );
                //     },function(err){
                //         console.log(err);
                //     });
                // });
                break;
                //删除banner数据
            case 'del':
                db.query(`DELETE FROM banner_table WHERE ID='${req.query.id}'`,function(err,data){
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.redirect('/admin/banner');
                    }
                });
                break;
            default :
                 //页面显示数据库中banner数据
                db.query(`SELECT * FROM banner_table`,function(err,banner_data){
                    if(err){
                        console.log(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.render('admin/banner',{banner_data:banner_data});
                    }
                })
                break;
        }

    });
    router.post('/',function(req,res){
        var title = req.body.title;
        var description = req.body.description;
        var href = req.body.href;

        if(!title || !description || !href){
            res.status(400).send('arg error').end();
        }else{
            if(req.body.mod_id){     //修改banner数据,\用来折行
                db.query(`UPDATE banner_table SET \
                    title='${req.body.title}', \
                    description='${req.body.description}', \
                    href='${req.body.href}' \
                    WHERE ID =${req.body.mod_id}`,function(err,data){
                        if(err){
                            console.error(err);
                            res.status(500).send('database error').end();
                        }else{
                            res.redirect('/admin/banner');
                        }
                });

            }else{     //添加banner数据
                db.query(`INSERT INTO banner_table (title,description,href) VALUE('${title}','${description}','${href}')`,function(err,data){
                    if(err){
                        res.status(500).send('database error').end();
                    }else{
                        res.redirect('/admin/banner');
                    }
                });
            }
        }

    });

    return router;
}
