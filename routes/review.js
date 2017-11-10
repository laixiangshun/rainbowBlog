/**
 * Created by lailai on 2017/11/8.
 */

var Review=require('./../models/review.js');
var message=require('./message.js');
var Blog=require('./../models/blog.js');
var Promise=require('promise');

//评论
exports.submitReview=function(req,res){
    var blogid = req.body.blogid;
    var hostid = req.session.user._id;
    var hostname = req.session.user.name;
    var hosticon = req.session.user.icon;
    var hostcontent = req.body.reviewContent;
    Review.findOne({blogid: blogid},function(err,blogview){
        if(!blogview){
            var reviewItem={
                blogid: blogid,
                reviewlist: [{
                    hostid: hostid,
                    hostname: hostname,
                    hosticon: hosticon,
                    hostcontent: hostcontent,
                    date: getTimeNow(),
                    reviewitem: []
                }]
            };
            var reviewhostid;
            saveReview(reviewItem).then(function(data){
                reviewhostid=data.reviewlist[0]._id;//获得楼主id
                return updateReview_num(blogid);
            }).then(function(blog){
                return message.saveMessage(blog,reviewhostid,hostcontent,2,req.session.user);
            }).then(function(ok){
                res.send('ok');
            }).catch(function(err){
                res.send('error');
            })
        }else{
            var reviewlists=blogview.reviewlist;
            var item={
                hostid: hostid,
                hostname: hostname,
                hosticon: hosticon,
                hostcontent: hostcontent,
                reviewitem: []
            };
            reviewlists.push(item);
            var reviewhostid;
            updateReviewList(blogid,reviewlists).then(function(msg){
                reviewhostid=msg;
                return updateReview_num(blogid);
            }).then(function(blog){
                return message.saveMessage(blog,reviewhostid,hostcontent,2,req.session.user);
            }).then(function(ok){
                res.send('ok');
            }).catch(function(err){
                res.send('error');
            })
        }
    })
};
function saveReview(reviewItem){
    return new Promise(function(resolve,reject){
        var review=new Review(reviewItem);
        review.save(function(err,data){
            if(err){
                reject('保存评论出错:'+err);
            }else{
                resolve(data);
            }
        })
    })
}
function updateReview_num(blogid){
    return new Promise(function(resolve,reject){
        Blog.findOne({_id: blogid},function(err,blog){
            Blog.update({_id: blogid},{review_num: blog.review_num+1},function(err,doc){
                if(err){
                    reject('更新评论数出错:'+err);
                }else{
                    resolve(blog);
                }
            })
        })
    })
}
//更新评论列表
function updateReviewList(blogid,reviewlist){
    return new Promise(function(resolve,reject){
        Review.update({blogid: blogid},{reviewlist: reviewlist},function(err,doc){
            if(err){
                reject('更新评论列表出错:'+err);
            }else{
                resolve('ok');
            }
        })
    }).then(function(msg){
            return getLastReviewHostId(blogid);
        }).catch(function(err){
            console.log(err);
        })
}
//获取新添加的评论的楼层ID
function getLastReviewHostId(blogid){
    return new Promise(function(resolve,reject){
        Review.findOne({blogid: blogid},function(err,data){
            if(err){
                console.log('获取新添加的评论的楼层ID出错:'+err);
                reject('error');
            }else{
                var lg=data.reviewlist.length;
                resolve(data.reviewlist[lg-1]._id);
            }
        })
    })
}

//提交用户间的评论
exports.submitReply=function(req,res){
    var blogid = req.body.blogid;
    var reviewhostid = req.body.reviewhostid;
    var olduserid = req.body.userid;
    var oldusername = req.body.username;
    var curuserid = req.session.user._id;
    var curusername = req.session.user.name;
    var content = req.body.content;
    Review.findOne({blogid: blogid},function(err,blogreview){
        if(!err){
            var item={
                userid: olduserid,
                username: oldusername,
                reuserid: curuserid,
                reusername: curusername,
                content: content,
                date: getTimeNow()
            };
            updateReviewItem(blogid,item,reviewhostid).then(function(msg){
                return updateReview_num(blogid);
            }).then(function(blog){
                return message.saveMessage(blog,reviewhostid,content,3,req.session.user);
            }).then(function(ok){
                res.send('ok');
            }).catch(function(err){
                res.send('error');
            })
        }
    })
};
//更新评论下的回复
function updateReviewItem(blogid,item,reviewhostid){
    return new Promise(function(resolve,reject){
        Review.findOne({blogid: blogid},function(err,review){
            if(err){
                console.log('回复评论出错:'+err);
                reject('error');
            }else{
                if(review.reviewlist.length){
                    for(var i=0;i<review.reviewlist.length;i++){
                        if(review.reviewlist[i]._id == reviewhostid){
                            review.reviewlist[i].reviewitem.push(item);
                            review.save(review.reviewlist[i]._id);
                            resolve('ok');
                            break;
                        }
                    }
                }else{
                    resolve(null);
                }
            }
        })
    })
}
//获得本地时间
function getTimeNow()
{
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour >= 0 && hour <= 9)
        hour = "0" + hour;
    if (minute >= 0 && minute <= 9)
        minute = "0" + minute;
    if (second >= 0 && second <= 9)
        second = "0" + second;
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + hour + seperator2 + minute
        + seperator2 + second;
    return currentdate;
}
