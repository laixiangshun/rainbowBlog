/**
 * Created by lailai on 2017/11/7.
 */
var mongoose=require('mongoose');
var review=require('./../schemas/review.js');

module.exports=mongoose.model('Review',review);