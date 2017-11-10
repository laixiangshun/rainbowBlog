/**
 * Created by lailai on 2017/11/9.
 */
var Promise=require('promise');
var Tag=require('./../models/tag.js');
var Blog=require('./../models/blog.js');
var message=require('./message.js');
var User=require('./../models/user.js');

exports.getAllBlogByTag=function(req,res){
    var user=req.session.user || null;
    var tagName=req.params.tagname;
    Tag.findOne({name: tagName},function(err,tag){
        if(tag!=null){
            var blogidList=tag.blogidList;
            var blogList=[];
            for(var i=0;i<blogidList.length;i++){
                blogList.push(new Promise(function(resolve,reject){
                    Blog.findOne({_id: blogidList[i].blogid},function(err,blog){
                        if(blog){
                            resolve(blog);
                        }else{
                            resolve(null);
                        }
                    })
                }))
            }
            Promise.all(blogList).then(function(result){
                var userlist=[];
                for(var i=0;i<result.length;i++){
                    userlist.push(new Promise(function(resolve,reject){
                        User.findOne({_id: result[i].authorid},function(err,user){
                            if(user){
                                resolve(user);
                            }else{
                                resolve(null);
                            }
                        })
                    }))
                }
                Promise.all(userlist).then(function(userlist){
                    if(user!=null){
                        message.totalUnreadMess(user._id).then(function(total){
                            res.render('list',{
                                title: 'rainbow博客--好时光',
                                user: user,
                                bloglist: result,
                                userlist: userlist,
                                totalmess: total,
                                error: ''
                            })
                        })
                    }else{
                        res.render('list',{
                            title: 'rainbow博客--好时光',
                            user: null,
                            bloglist: result,
                            userlist: userlist,
                            totalmess: 0,
                            error: ''
                        })
                    }

                }).catch(function(err){
                    console.log('根据标签查找文章出错:'+err);
                })
            }).catch(function(err){
                console.log('根据标签查找文章出错:'+err);
            })
        }
    })
};
