/**
 * Created by lailai on 2017/11/10.
 */
var mongoose=require('mongoose');
var follow=require('./../schemas/follow.js');

module.exports=mongoose.model('follow',follow);