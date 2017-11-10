/**
 * Created by lailai on 2017/11/6.
 */
var User=require('./../models/user.js');

exports.createUser=function(req,res){
    var username=req.body.username;
    var userpass=req.body.userpass;
    var userinfo={
        name: username,
        password: userpass,
        icon: '12.png',
        sex: '',
        tel: '',
        qq: '',
        weixin: '',
        weibo: '',
        email: req.body.useremail
    };
    var user=new User(userinfo);
    user.save(function(err,data){
        if(err){
            console.log('register user failed :'+err);
        }else{
            console.log(data);
            res.redirect('/login');
        }
    })
};