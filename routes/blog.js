/**
 * Created by lailai on 2017/11/6.
 */
var Blog=require('./../models/blog.js');
var User=require('./../models/user.js');
var message=require('./message.js');
var Review=require('./../models/review.js');
var Promise=require('promise');
var Tag=require('./../models/tag.js');


//获取所有文章列表
exports.getAllBlog=function(req,res){
    var user=req.session.user || null;
    if(user==null){
        res.redirect('/login');
        return;
    }
    Blog.find({},function(err,bloglist){
        if(err){
            console.log('get bloglist failed:'+err);
        }else if(bloglist.length){
            var userlist=[];
            for(var i=0;i<bloglist.length;i++){
                userlist.push(new Promise(function(resolve,reject){
                    User.findOne({_id: bloglist[i].authorid},function(err,user){
                        if(user){
                            resolve(user);
                        }else{
                            reject(null);
                        }
                    })
                }))
            }
            Promise.all(userlist).then(function(userlist){
                message.totalUnreadMess(user._id).then(function(total){
                    res.render('list',{
                        title: 'rainbow博客--好时光',
                        user: user,
                        bloglist: bloglist,
                        userlist: userlist,
                        totalmess: total,
                        error: ''
                    })
                })
            }).catch(function(err){
                console.log(err);
            })
        }else{
            res.render('list',{
                title: 'rainbow博客--文章列表',
                user: user,
                error: '没人拜访，好桑心！',
                totalmess: 0
            });
        }
    });
};

//提交博客文章
exports.createBlog=function(req,res){
    var user=req.session.user || null;
    if(user==null || user==''){
        res.redirect('/login');
        return;
    }
    var blogmess={
        title: req.body.blogtitle,
        authorid: req.session.user._id,
        content: req.body.blogcontent,
        date: getTimeNow(),
        tag: req.body.blogtag,
        like_num: 0,
        review_num: 0,
        look_num: 0
    };
    var blog=new Blog(blogmess);
    blog.save(function(err,data){
        if(err){
            console.log('save blog failed:'+err);
        }else{
            console.log(data);
            saveBlogTag(data).then(function(ok){
                res.redirect('/bloglist');
            })
        }
    })
};
//保存文章的标签
function saveBlogTag(blog){
    return new Promise(function(resolve,reject){
        Tag.findOne({name: blog.tag},function(err,tag){
            if(tag!=null){
                var item={
                    blogid: blog._id,
                    blogname: blog.title
                };
                var bloglist=tag.blogidList;
                bloglist.push(item);
                Tag.update({name: blog.tag},{blogidList: bloglist},function(err,doc){
                    if(err){
                        console.log('保存标签中的文章出错:'+err);
                    }else{
                        resolve('ok');
                    }
                })
            }else{
                var tagitem={
                    name: blog.tag,
                    blogidList: [{
                        blogid: blog._id,
                        blogname: blog.title
                    }]
                };
                var tag=new Tag(tagitem);
                tag.save(function(err,data){
                    if(err){
                        console.log('在'+blog.tag+'下保存文章出错:'+err);
                    }else{
                        resolve('ok');
                    }
                })
            }
        })
    })
}
//获取某条博客的信息，并更新浏览次数
exports.getBlog=function(req,res){
    var user=req.session.user || null;
    var error='';
    var blogid=req.params.blogid;
    Blog.findOne({_id: blogid},function(err,blog){
        if(blog ==null){
            error='该文章也被作者删除';
            res.render({
                error: error
            });
        }else{
            //更新文章浏览次数
            var promise1=updateLook_num(blogid);
            //查找作者信息
            var promise2=findUser(blog.authorid);
            //获取该文章的所有评论信息
            var promise3=findReview(blogid);
            //查看未读消息
            var promise4=message.totalUnreadMess(blog.authorid);

            Promise.all([promise1,promise2,promise3,promise4]).then(function(result){
                res.render('blogdetail',{
                    title: blog.title,
                    error: error,
                    blog: blog,
                    user: user,
                    author: result[1],
                    reviewlist: result[2],
                    totalmess: result[3]
                })
            }).catch(function(err){
                console.log('查看文章详细信息出错');
            })
        }
    })
};

//更新文章浏览次数
function updateLook_num(blogid){
    return new Promise(function(resolve,reject){
        Blog.update({_id: blogid},{$inc: {look_num: +1}},function(err,doc){
            if(err){
                reject('更新文章浏览次数出错');
            }else{
                resolve('ok');
            }
        })
    })
}
//获取作者信息
function findUser(authorid){
    return new Promise(function(resolve,reject){
        User.findOne({_id: authorid},function(err,user){
            if(err){
                reject('获取作者信息出错');
            }else{
                resolve(user);
            }
        })
    })
}
//获取该文章的所有评论
function findReview(blogid){
    return new Promise(function(resolve,reject){
        Review.findOne({blogid: blogid},function(err,reviews){
            if(err){
                reject('获取文章评论出错');
            }else if(reviews){
                resolve(reviews.reviewlist);
            }else{
                resolve(null);
            }
        })
    })
}
//更新喜欢的次数
exports.updateLike=function(req,res){
    var user=req.session.user ||null;
    if(user==null){
        res.send('nologin');
        return;
    }
    var blogid=req.query.blogid;
    Blog.update({_id: blogid},{$inc: {like_num: +1}},function(err,blog){
        if(err){
            console.log('更新喜欢次数出错:'+err);
        }else{
            //向用户的消息列表中插入一条未读消息
            Blog.findOne({_id: blogid},function(err,blog){
                message.saveMessage(blog,'','',1,req.session.user).then(function(ok){
                    res.send('ok');
                }).catch(function(err){
                    res.send('error');
                })
            })
        }
    })
};

function getTimeNow(){
    var date=new Date();
    var sp1='-';
    var sp2=':';
    var month=date.getMonth()+1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if(month>=1 && month<=9){
        month='0'+month;
    }
    if(strDate>=1 && strDate<=9){
        strDate='0'+strDate;
    }
    if(hour>=1 && hour<=9){
        hour='0'+hour;
    }
    if(minute>=1 && minute<=9){
        minute='0'+minute;
    }
    if(second>0 && second<10){
        second='0'+second;
    }
    var currentdate=date.getFullYear()+sp1+month+sp1+strDate+' '+hour+sp2+minute+sp2+second;
    return currentdate;
}