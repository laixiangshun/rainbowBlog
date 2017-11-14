/**
 * Created by lailai on 2017/11/13.
 * 上传头像
 */
var multer=require('./../multerUtil.js');
var User=require('./../models/user.js');

var upload=multer.single('thumb');
exports.dataInput=function(req,res){
    var user=req.session.user || null;
    if(user ==null){
        res.redirect('/login');
        return;
    }
    upload(req,res,function(err){
        if(err){
            console.log('上传文件出错:'+err);
        }
        User.update({_id: user._id},{icon: req.file.filename},function(err,doc){
            if(err){
                console.log('上传头像出错:'+err);
               res.send({result: '上传头像出错'});
            }
            else{
                User.findOne({_id: user._id},function(err,user){
                    if(user){
                        console.log(user);
                        req.session.user=user;
                        res.send({result: 'ok'});
                    }
                })
            }
        });
        console.log(req.file);
    })
};