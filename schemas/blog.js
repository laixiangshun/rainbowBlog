/**
 * Created by lailai on 2017/11/6.
 */
var Schema = require('mongoose').Schema;

var blogSchema = new Schema({
    title: String,  //���±���
    authorid: String,  //�������µ�����Id
    content: String, //��������
    date: String, //��������
    tag: String, //���±�ǩ
    like_num: Number,  //ϲ������
    review_num: Number, //��������
    look_num: Number //�������
});

module.exports = blogSchema;