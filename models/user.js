/**
 * Created by lailai on 2017/11/6.
 */
var mongoose=require('mongoose');
var User=require('./../schemas/user.js');

module.exports=mongoose.model('User',User);//指定创建的文档和对应的数据结构