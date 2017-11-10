/**
 * Created by lailai on 2017/11/9.
 */
var mongoose=require('mongoose');
var tag=require('./../schemas/tag.js');

module.exports=mongoose.model('Tag',tag);