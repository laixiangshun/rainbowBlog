/**
 * Created by lailai on 2017/11/6.
 */

var Message=require('./../models/message.js');
var Promise=require('promise');

//获取未读消息的数量
exports.totalUnreadMess=function(authorid){
    return new Promise(function(resolve,reject){
        if(authorid){
            var count=0;
            Message.findOne({authorid: authorid},function(err,mess){
                if(err){
                    console.log('查询未读消息出错:'+err);
                }else{
                    if(mess){
                        var messlist=mess.messagelist;
                        for(var i=0;i<messlist.length;i++){
                            if(messlist[i].status==0){
                                count++;
                            }
                        }
                    }
                }
                resolve(count);
            })
        }
    })
};
//保存消息
exports.saveMessage=function(blog,hostid,content,type,user){
    return new Promise(function(resolve,reject){
        Message.findOne({authorid: blog.authorid},function(err,messlist){
            if(!messlist){
                var msglist={
                    authorid: blog.authorid,
                    messagelist: [{
                        reuserid: user._id,
                        reusername: user.name,
                        reusericon: user.icon,
                        blogid: blog._id,
                        blogname: blog.title,
                        hostid: hostid,
                        content: content,
                        actiontype: type,//1表示喜欢, 2表示评论, 值为3表示回复
                        status: 0,//0表示未查看, 1表示已查看
                        date: getTimeNow()
                    }]
                };
                var message=new Message(msglist);

                message.save(function(err,data){
                    if(err){
                        reject('保存消息出错:'+err);
                    }else{
                        resolve('ok');
                    }
                })
            }else{
                var msgitem={
                    reuserid: user._id,
                    reusername: user.name,
                    reusericon: user.icon,
                    blogid: blog._id,
                    blogname: blog.title,
                    hostid: hostid,
                    content: content,
                    actiontype: type,
                    status: 0,
                    date: getTimeNow()
                };
                messlist.messagelist.push(msgitem);
                messlist.save();
                resolve('ok');
            }
        })
    })
};

//获取所有的消息页面
exports.getAllMessage=function(req,res){
    var user=req.session.user || null;
    if(user==null || user==''){
        res.redirect('/login');
        return;
    }
    var authorid=user._id;
    Message.findOne({authorid: authorid},function(err,mess){
        if(mess){
            var messagelist=mess.messagelist;
            for(var i=0;i<messagelist.length;i++){
                messagelist[i].status=1;
            }
            Message.update({authorid: authorid},{messagelist: messagelist},function(err,doc){
                if(doc.ok){
                    res.render('message',{
                        title: 'rainbow博客--消息',
                        user: user,
                        messlist: messagelist,
                        totalmess: '',
                        error: ''
                    })
                }
            });
        }else{
            res.render('message',{
                title: 'rainbow博客--消息',
                user: user,
                messlist: 0,
                totalmess: '',
                error: ''
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