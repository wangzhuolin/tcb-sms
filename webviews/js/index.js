const envID = '云开发环境ID'
/**
 * 启动服务
 */
window.onload=function(){
    try{
        initTcb();
    }
    catch(e){
        toHide(['mainTool','itemView-0','itemView-1']);
        showModel('此浏览器不支持文件服务，请到其他浏览器打开！', 40000, 'error');
    }
};

/**
 * 云开发SDK初始化服务（匿名登录）
 * @param success 成功的callback
 */
function initTcb(success=()=>{}) {
    app = tcb.init({
        env: envID
    });
    const auth = app.auth();
    auth.signInAnonymously().then(() => {
        auth.getLoginState().then((e) => {
            uid = e.credential.refreshToken;
            console.log('匿名登录成功，初始化完成！');
            initFlag = true;
            success();
        });
    }).catch(err => {
        showModel('初始化失败，请检查网络后重新刷新页面！如果一直出现此情况请反馈给腾讯云云开发', 10000, 'error');
    });
}


/**
 * 短信发送请求函数
 * @param res 腾讯验证码
 */
function sendSms(res) {
    if(res.ret!==0)return;
    let tplid = getElm('tplid').value;
    let phone = getElm('phone').value;
    let name = getElm('name').value;
    editClass('TencentCaptcha',{
        addT:[{
            name:'disabled',
            value:''
        }]
    });
    editClass('sendBtnText',{
        text:'发送请求中'
    });
    calls({
        url:'https://'+envID+'.service.tcloudbase.com/sendsms',
        data:{
            tplid:tplid,
            phone:phone,
            name: name,
            uid:uid,
            code:res
        },
        success(res){
            if(res.result.result.code===0){
                showModel('短信请求成功，请查收！', 3000, 'success');
                editClass('TencentCaptcha',{
                    removeT:['disabled']
                });
                editClass('sendBtnText',{
                    text:'发送短信'
                });
            }
            else if(res.result.result.code===1){
                showModel('接口调用失败，请稍后重试！', 6000, 'warning');
                editClass('TencentCaptcha',{
                    removeT:['disabled']
                });
                editClass('sendBtnText',{
                    text:'发送短信'
                });
            }
            else{
                showModel('系统繁忙，可能使用人数太多，请稍后再试！', 6000, 'error');
                editClass('TencentCaptcha',{
                    removeT:['disabled']
                });
                editClass('sendBtnText',{
                    text:'发送短信'
                });
            }
        },
        fail(){
            showModel('系统繁忙，维护中，请稍后再试！', 6000, 'error');
            editClass('TencentCaptcha',{
                removeT:['disabled']
            });
            editClass('sendBtnText',{
                text:'发送短信'
            });
        }
    });
}