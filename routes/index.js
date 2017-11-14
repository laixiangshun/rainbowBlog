/**
 * Created by lailai on 2017/11/6.
 */
var login=require('./login.js');
var register=require('./register.js');
var blog=require('./blog.js');
var message=require('./message.js');
var review=require('./review.js');
var user=require('./user.js');
var tag=require('./tag.js');
var upload=require('./upload.js');

module.exports=function(app){
  app.get('/home',function(req,res){
      var user=req.session.user || null;
      res.render('index',{
          title: 'rainbow博客--首页'
      })
  });
    app.get('/login',function(req,res){
        var user=req.session.user || null;
        res.render('login',{
            title: 'rainbow博客--登录',
            error:''
        })
    });
    app.get('/register',function(req,res){
        var user=req.session.user || null;
        res.render('register',{
            title: 'rainbow博客--注册'
        })
    });
    //登出
    app.get('/logout',function(req,res){
        var user=req.session.user || null;
        if(user){
            req.session.user = null;
            console.log(req.session.user);
            res.redirect('/home');
        }
    });
    //登录
    app.post('/doLogin',login.checkLogin);
    //文章列表界面
    app.get('/bloglist',blog.getAllBlog);
    //注册
    app.post('/doRegister',register.createUser);
    //写博客
    app.get('/writeBlog',function(req,res){
        var user=req.session.user || null;
        if(user==null || user==''){
            res.redirect('/login');
            return;
        }
        message.totalUnreadMess(user._id).then(function(total){
            res.render('writeblog',{
                title: 'rainbow博客--写博客',
                user: user,
                totalmess: total
            })
        })
    });
    //提交博客
    app.post('/submitBlog',blog.createBlog);

    //文章详情页
    app.get('/blog/:blogid',blog.getBlog);

    //点击喜欢
    app.get('/updateLike',blog.updateLike);

    //提交评论
    app.post('/submitReview',review.submitReview);

    //提交回复
    app.post('/submitReply',review.submitReply);

    //获取所有的消息列表
    app.get('/messlist',message.getAllMessage);

    //查看自己的所有文章
    app.get('/myblog/:userid',user.getBlogByUser);

    //用户中心
    app.get('/usercenter',user.getUserMess);

    //更新用户信息
    app.post('/updateUsermess',user.updateUserMess);

    //账户信息
    app.get('/account',user.account);

    //根据标签查找所有关于该标签的文章
    app.get('/blogtag/:tagname',tag.getAllBlogByTag);

    //点击头像查看作者信息
    app.get('/getAuthorInfo/:authorid',user.getAuthorInfo);

    //关注作者
    app.post('/follow',user.followAuthor);
    //取消关注
    app.post('/unfollow',user.unFollowAuthor);

    //点击作者名称进入作者文章列表页面
    app.get('/getAuthorBlog/:authorid',user.getAuthorBlogs);

    //关注页面
    app.get('/followAuthors',user.getAllFollowAuthors);

    //上传头像
    app.post('/uploadImg',upload.dataInput);

    //修改密码
    app.post('/restpassword',user.getUserByEmail);
    app.post('/submitRestPass',user.updateUserPass);

    //关于
    app.get('/about',function(req,res){
        var user=req.session.user || null;
        res.render('about',{
            title: 'rainbow博客--关于',
            user: user,
            totalmess: null
        })
    });
};