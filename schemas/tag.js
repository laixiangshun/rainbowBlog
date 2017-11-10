/**
 * Created by lailai on 2017/11/9.
 * 博客文章标签集合
 * 每一种标签也名称区别，下面包括所有包含该标签的文章的集合
 */
var Schema=require('mongoose').Schema;

var tag=new Schema({
    name: String,
    blogidList: [{
        blogid: String,
        blogname: String
    }]
});

module.exports=tag;