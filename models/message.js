/**
 * Created by lailai on 2017/11/6.
 */
var mongoose=require('mongoose');
var Message=require('./../schemas/message.js');

module.exports=mongoose.model('Message',Message);