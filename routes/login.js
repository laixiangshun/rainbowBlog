/**
 * Created by lailai on 2017/11/6.
 */
var User=require('./../models/user.js');

exports.checkLogin=function(req,res){
    var username=req.body.username;
    var userpasww=req.body.userpass;

    User.findOne({name: username},function(err,user){
        if(err){
            console.log('user login failed :'+err);
        }else{
            if(user==null){
                User.findOne({eamil: username},function(err,user){
                    if(user == null){
                        res.render('login',{
                            title: 'rainbow博客--登录',
                            error: '用户名不存在'
                        })
                    }else{
                        if(user.password != userpasww){
                            res.render('login',{
                                title: 'rainbow博客--登录',
                                error: '密码错误'
                            })
                        }else{
                            req.session.user=user;
                            res.redirect('/bloglist');
                        }
                    }
                })
            }else{
                if(user.password !=userpasww){
                    res.render('login',{
                        title: 'rainbow博客--登录',
                        error: '密码错误'
                    })
                }else{
                    req.session.user=user;
                    res.redirect('/bloglist');
                }
            }
        }
    })
};