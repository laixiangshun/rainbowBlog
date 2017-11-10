/**
 * Created by lailai on 2017/11/7.
 */
function getRequest(){
    var request=null;
    if(XMLHttpRequest){
        request=new XMLHttpRequest();
    }else{
        request=new ActiveXObject('Microsoft.XMLHTTP');
    }
    return request;
}
function likeit(blogid){
   var req =getRequest();
    var url='/updateLike?blogid='+blogid;
    req.open('get',url,true);
    req.onreadystatechange=function(){
        if(req.readyState==4){
            if(req.responseText=='ok'){
                var likeid=document.getElementById('like');
                likeid.innerText=parseInt(likeid.innerText)+1+'';
            }else if(req.responseText=='nologin'){
                alert('请先登录在进行操作');
                window.location.href='/login';
            }else{
                console.log(req.responseText+'出错了');
            }
        }
    };
    req.send();
}

function submitReview(blogid,user){
    if(user==null || user==''){
        alert('请先登录在进行评论');
        window.location.href='/login';
        return;
    }
    var content=document.getElementById('reviewdialog').value;
    var req=getRequest();
    var url='/submitReview';
    req.open('post',url,true);
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.onreadystatechange=function(){
        if(req.readyState==4){
            if(req.responseText=='ok'){
                location.reload();
            }else{
                console.log(req.responseText+'出错了');
            }
        }
    };
    req.send('blogid='+blogid+'&reviewContent='+content);
}
//评论输入框检查是否登录，没登了先登录
function checkLogin(user){
    if(user==null || user==''){
        //alert('请先登录在进行评论');
        setTimeout(function(){
            window.location.href='/login';
        },500);
        return false;
    }
}

var hostname='',hostid='';
function showReplyDialog(host_name,id,host_id,user){
    var e=window.event;
    e.stopPropagation();
    checkLogin(user);
    var dialog=document.getElementsByName('dialog');
    for(var i=0;i<dialog.length;i++){
        dialog[i].style.display='none';
    }
    var replydilog=document.querySelector('.dialog'+id);
    replydilog.style.display='block';
    replydilog.focus();
    var dialog=document.getElementById(id);
    hostname=host_name;
    hostid=host_id;
    dialog.value='@'+hostname+':';
}

function reply(blogid,id,reviewhostid){
    var input=document.getElementById(id);
    var content=input.value.split(':');
    content.shift();
    content.join(':');
    input.value='';
    var req=getRequest();
    var url='/submitReply';
    req.open('post',url,true);
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.onreadystatechange=function(){
        if(req.readyState==4){
            if(req.responseText=='ok'){
                setTimeout(function(){
                    location.reload();
                },1000);
            }else{
                console.log('回复消息出错');
            }
        }
    };
    req.send('blogid='+blogid+'&reviewhostid='+reviewhostid+'&userid='+hostid+'&username='+hostname+'&content='+content.toString());
}
    $(document).click(function(){
        $("div[name='dialog']").hide();
    });
    $("textarea[name='reviewdialog']").click(function(e){
        var e=e || window.event;
        e.stopPropagation();//阻止事件冒泡
    });

