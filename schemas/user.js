/**
 * Created by lailai on 2017/11/6.
 */

var Schema=require('mongoose').Schema;

var userSchema=new Schema({
    name: String,
    password: String,
    icon: String,
    sex: String,
    tel: String,
    qq: String,
    weixin: String,
    weibo: String,
    email: String
});
module.exports=userSchema;