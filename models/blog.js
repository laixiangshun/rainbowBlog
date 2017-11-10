/**
 * Created by lailai on 2017/11/6.
 */
var mongoose = require('mongoose');
var Blog = require('../schemas/blog.js');

module.exports = mongoose.model('Blog', Blog);