/**
 * Created by lailai on 2017/11/8.
 */

var Blog=require('./../models/blog.js');
var Promise=require('promise');
var User=require('./../models/user.js');
var message=require('./message.js');

exports.getBlogByUser=function(req,res){
   var user=req.session.user || null;
    if(user==null){
        res.redirect('/login');
        return;
    }
    Blog.find({authorid: user._id},function(err,bloglist){
        if(bloglist){
            message.totalUnreadMess(user._id).then(function(total){
                res.render('myblog',{
                    title: 'rainbow博客--我的文章',
                    totalmess: total,
                    user: user,
                    bloglist: bloglist
                })
            })
        }else{
            message.totalUnreadMess(user._id).then(function(total){
                res.render('myblog',{
                    title: 'rainbow博客--我的文章',
                    totalmess: total,
                    user: user,
                    bloglist: null
                })
            })
        }
    })
};
//用户中心--获取用户信息
exports.getUserMess=function(req,res){
    var user=req.session.user || null;
    if(user==null){
        res.redirect('/login');
        return;
    }
    User.findOne({_id: user._id},function(err,user){
        if(err){
            console.log('获取用户信息出错:'+err);
        }else{
            message.totalUnreadMess(user._id).then(function(total){
                res.render('usermess',{
                    title: 'rainbow博客--个人中心',
                    user: user,
                    totalmess: total
                })
            })
        }
    })
};

//更新用户
exports.updateUserMess=function(req,res){
  var user=req.session.user || null;
    if(user ==null){
        res.redirect('/login');
        return ;
    }
    var username = req.body.username ? req.body.username : req.session.user.name;
    var usersex = req.body.usersex ? req.body.usersex : req.session.user.sex;
    var usertel = req.body.usertel ? req.body.usertel : req.session.user.tel;
    var useremail = req.body.useremail ? req.body.useremail : req.session.user.email;

    User.update({_id: user._id},{
        name: username,
        sex: usersex,
        tel: usertel,
        email: useremail
    },function(err,doc){
        if(doc.ok){
            res.redirect('/usercenter');
        }else{
            console.log('更新用户出错:'+err);
        }
    })
};

//账户信息
exports.account=function(req,res){
    var user=req.session.user || null;
    if(user ==null){
        res.redirect('/login');
        return;
    }
    message.totalUnreadMess(user._id).then(function(total){
        res.render('account',{
            title: 'rainbow博客--账户信息',
            user: user,
            totalmess: total
        })
    })
};