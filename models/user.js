/**
 * Created by lailai on 2017/11/6.
 */
var mongoose=require('mongoose');
var User=require('./../schemas/user.js');

module.exports=mongoose.model('User',User);//ָ���������ĵ��Ͷ�Ӧ�����ݽṹ