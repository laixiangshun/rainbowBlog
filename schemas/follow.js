/**
 * Created by lailai on 2017/11/10.
 * 为每个用户创建一个关注者集合
 * 集合中包含关注的所有作者信息
 */
var Schema=require('mongoose').Schema;

var follow=new Schema({
    userid: String,
    followList: [{
        authorid: String,
        authorname: String
    }]
});
module.exports=follow;