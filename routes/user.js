/**
 * Created by lailai on 2017/11/8.
 */

var Blog=require('./../models/blog.js');
var Promise=require('promise');
var User=require('./../models/user.js');
var message=require('./message.js');
var Follow=require('./../models/follow.js');

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

//根据作者获取该作者的信息
exports.getAuthorInfo=function(req,res){
    var user=req.session.user ||null;
    if(user==null){
        res.redirect('/login');
        return;
    }
    var authorid=req.params.authorid;
    if(user._id != authorid) {
        User.findOne({_id: authorid}, function (err, author) {
            if (err) {
                console.log('获取作者信息出错:' + err);
            } else {
                message.totalUnreadMess(user._id).then(function (total) {
                    res.render('authorInfo', {
                        title: 'rainbow博客--作者信息',
                        user: author,
                        totalmess: total,
                        self: user //当前登录用户
                    })
                })
            }
        })
    }else{
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
    }
};

//关注作者
exports.followAuthor=function(req,res){
    var user=req.session.user || null;
    if(user=null){
        res.redirect('/login');
        return;
    }
    var authorid=req.body.authorid;
        User.findOne({_id: authorid},function(err,author){
            if(author){
                Follow.findOne({userid: user._id},function(err,follow){
                    if(follow){
                        var item={
                            authorid: authorid,
                            authorname: author.name
                        };
                        var followlist=follow.followList;
                        followlist.push(item);
                        Follow.update({userid: user._id},{followList: followlist},function(err,doc){
                            if(err){
                                console.log('关注出错:'+err);
                                res.status=200;
                                res.type='application/json';
                                res.body={result: '关注出错'};
                            }else{
                                res.status=200;
                                res.type='application/json';
                                res.body={result: 'ok'};
                            }
                        })
                    }else{
                        var followItem={
                            userid: user._id,
                            followList: [{
                                authorid: authorid,
                                authorname: author.name
                            }]
                        };
                        var follow=new Follow(followItem);
                        follow.save(function(err,doc){
                            if(err){
                                console.log('关注出错:'+err);
                                res.status=200;
                                res.type='application/json';
                                res.body={result: '关注出错'};
                            }else{
                                res.status=200;
                                res.type='application/json';
                                res.body={result: 'ok'};
                            }
                        })
                    }
                })
            }else{
                res.status=200;
                res.type='application/json';
                res.body={result: '找不到该作者'};
            }
    })
};