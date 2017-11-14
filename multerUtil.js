/**
 * Created by lailai on 2017/11/13.
 */
var multer=require('multer');
var storage=multer.diskStorage({
    //设置上传后的文件路径
    destination: function(req,file,cb){
        cb(null,'./static/images')
    },
    //给上传的文件重命名
    filename: function(req,file,cb){
        var fileFormate=(file.originalname).split('.');
        cb(null,file.fieldname+'-'+Date.now()+'.'+fileFormate[fileFormate.length-1]);
    }
});
var upload=multer({
    storage: storage
});

module.exports=upload;