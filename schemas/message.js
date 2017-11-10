/**
 * Created by lailai on 2017/11/6.
 */
var Schema=require('mongoose').Schema;

/*
    为每个作者创建一个储存所有消息的集合
 */
var messageSchema = new Schema({
    authorid: String,   //文章作者id
    messagelist: [{
        reuserid: String,  //评论用户id
        reusername: String, //评论用户name
        reusericon: String,  //评论用户icon
        blogid: String, //博客的id
        blogname: String, //博客的name
        hostid: String,
        content: String,  //评论内容
        actiontype: Number,  //1表示喜欢, 2表示评论, 值为3表示回复
        status: Number, //0表示未查看, 1表示已查看
        date: String
    }]
});

module.exports = messageSchema;