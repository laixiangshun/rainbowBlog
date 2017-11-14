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
        if(!err){
            if(doc.ok){
                User.findOne({_id: user._id},function(err,user){
                    if(user){
                        console.log(user);
                        req.session.user=user;
                        res.redirect('/usercenter');
                    }
                })
            }
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
                    var isFollow=false; //是否关注
                    Follow.findOne({userid: user._id},function(err,follow){
                        if(follow){
                            var followlist=follow.followList;
                            for(var i=0;i<followlist.length;i++){
                                if(followlist[i].authorid == authorid){
                                    isFollow=true;
                                    break;
                                }
                            }
                            res.render('authorInfo', {
                                title: 'rainbow博客--作者信息',
                                user: author,
                                totalmess: total,
                                isFollow: isFollow //当前登录用户
                            })
                        }else{
                            res.render('authorInfo', {
                                title: 'rainbow博客--作者信息',
                                user: author,
                                totalmess: total,
                                isFollow: isFollow//当前登录用户
                            })
                        }
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
    if(user==null){
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
                                res.send({result: '关注出错'});
                            }else{
                                //res.body={result: 'ok'};
                                res.send({result: 'ok'});
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
                                res.send({result: '关注出错'});
                            }else{
                                res.send({result: 'ok'});
                            }
                        })
                    }
                })
            }else{
                res.send({result: '找不到该作者'});
            }
    })
};

//取消关注
exports.unFollowAuthor=function(req,res){
  var user=req.session.user || null;
    if(user==null){
        res.redirect('/login');
        return;
    }
    var authorid=req.body.authorid;
    Follow.findOne({userid: user._id},function(err,follow){
        if(follow){
            var followlist=follow.followList;
            console.log(followlist);
            var followList=[];
            for(var i=0;i<followlist.length;i++){
                if(followlist[i].authorid == authorid){
                    //console.log('111111');
                    //followList=followlist.remove(i);
                    followList=followlist.del(i);
                    console.log(followList);
                    break;
                }
            }
            Follow.update({userid: user._id},{followList: followList},function(err,doc){
                if(err){
                    console.log('取消关注出错:'+err);
                    res.send({result: '取消关注出错'});
                }else{
                    res.send({result: 'ok'});
                }
            })
        }else{
            res.send({result: '您还没有关注！'});
        }
    })
};

//数组删除其中一个元素
Array.prototype.remove=function(dx){
  if(isNaN(dx) || dx>this.length){
      return false;
  }
    var list=[];
    for(var i= 0,n=0;i<this.length;i++){
        if(this[i]!=this[dx]){
            list.push(this[i]);
        }
    }
    //this.length-=1;
    return list;
};
Array.prototype.del=function(n){
    if(n<0){
        return this;
    }
    else{
        return this.slice(0,n).concat(this.slice(n+1,this.length));
    }
};

//进入作者文章列表页面
exports.getAuthorBlogs=function(req,res){
    var user=req.session.user || null;
    if(user == null){
        res.redirect('/login');
        return;
    }
    var authorid=req.params.authorid;
    User.findOne({_id: authorid},function(err,author){
        if(author){
            Blog.find({authorid: authorid},function(err,bloglist){
                var isFollow=false;
                if(bloglist){
                    message.totalUnreadMess(user._id).then(function(total){
                        Follow.findOne({userid: user._id},function(err,follow){
                            if(follow){
                                var followList=follow.followList;
                                for(var i=0;i<followList.length;i++){
                                    if(followList[i].authorid == authorid){
                                        isFollow=true;
                                        break;
                                    }
                                }
                                res.render('authorBlogs',{
                                    title: 'rainbow博客--作者文章',
                                    user: author,
                                    totalmess: total,
                                    bloglist: bloglist,
                                    isFollow: isFollow
                                })
                            }else{
                                res.render('authorBlogs',{
                                    title: 'rainbow博客--作者文章',
                                    user: author,
                                    totalmess: total,
                                    bloglist: bloglist,
                                    isFollow: isFollow
                                })
                            }
                        })
                    })
                }else{
                    message.totalUnreadMess(user._id).then(function(total){
                        Follow.findOne({userid: user._id},function(err,follow){
                            if(follow){
                                var followList=follow.followList;
                                for(var i=0;i<followList.length;i++){
                                    if(followList[i].authorid == authorid){
                                        isFollow=true;
                                        break;
                                    }
                                }
                                res.render('authorBlogs',{
                                    title: 'rainbow博客--作者文章',
                                    user: author,
                                    totalmess: total,
                                    bloglist: bloglist,
                                    isFollow: isFollow
                                })
                            }else{
                                res.render('authorBlogs',{
                                    title: 'rainbow博客--作者文章',
                                    user: author,
                                    totalmess: total,
                                    bloglist: bloglist,
                                    isFollow: isFollow
                                })
                            }
                        })
                    })
                }
            })
        }
    })
};

//关注页面
exports.getAllFollowAuthors=function(req,res){
    var user=req.session.user || null;
    if(user==null){
        res.redirect('/login');
        return;
    }
    Follow.findOne({userid: user._id},function(err,follow){
        if(follow.followList.length>0){
            var followlist=follow.followList;
            var userlist=[];
            for(var i=0;i<followlist.length;i++){
                userlist.push(new Promise(function(resolve,reject){
                    User.findOne({_id: followlist[i].authorid},function(err,user){
                        if(user){
                            resolve(user);
                        }else{
                            resolve(null);
                        }
                    })
                }))
            }
            Promise.all(userlist).then(function(userlist){
                message.totalUnreadMess(user._id).then(function(total){
                    res.render('followAuthors',{
                        title: 'rainbow博客--关注',
                        user: user,
                        totalmess: total,
                        followList: userlist
                    })
                })
            })
        }else{
            message.totalUnreadMess(user._id).then(function(total){
                res.render('followAuthors',{
                    title: 'rainbow博客--关注',
                    user: user,
                    totalmess: total,
                    followList: ''
                })
            })
        }
    })
};