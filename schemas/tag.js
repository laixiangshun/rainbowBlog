/**
 * Created by lailai on 2017/11/9.
 * �������±�ǩ����
 * ÿһ�ֱ�ǩҲ������������������а����ñ�ǩ�����µļ���
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