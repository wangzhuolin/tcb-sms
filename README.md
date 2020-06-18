# TCB-SMS | 腾讯云云开发短信发送

本工具完全使用**腾讯云云开发**提供的服务进行部署

展示URL：[https://sms.sudagaoxiao.com](https://sms.sudagaoxiao.com)



### 技术使用

- 腾讯云验证码

- 腾讯云短信服务

- 腾讯云云开发云函数

- 前端静态资源部署在腾讯云云开发的静态网站托管服务上

### 项目地址

GitHub: [tcb-sms](https://github.com/wangzhuolin/tcb-sms)

### 前提准备

- 在正式开始部署本项目前，请访问[Web端入门须知](https://tencentcloudbase.github.io/2020-02-14-init)、[开发准备文档](https://tencentcloudbase.github.io/2020-02-14-prepare)，掌握了解云开发Web端的基本概念和学习使用云开发CLI工具以及环境创建流程。

### 部署步骤

##### 一、创建云开发环境

- 访问[腾讯云云开发控制台](https://console.cloud.tencent.com/tcb),新建【按量计费云开发环境】，记住云开发环境ID。
- 进入[静态网站控制页](https://console.cloud.tencent.com/tcb/hosting)，开通静态网站托管服务
- 进入[用户管理控制页](https://console.cloud.tencent.com/tcb/user)-登录设置的登录方式中，勾选[匿名登录]()

##### 二、配置项目

- 用代码工具打开项目目录，将以下文件中标注有【云开发环境ID】处替换成**自己的云开发环境ID**

    - cloudfunctions/cloudbaserc.js 第2行
    - webviews/js/index.js 第1行

- 前往腾讯云访问密钥的[API密钥管理](https://console.cloud.tencent.com/cam/capi)，点击**新建密钥**，就可以创建密钥了，创建之后，就可以看到 `SecretID`和`SecretKey`

    - cloudfunctions/functions/dosendsms/index.js 第10行

- 登录[腾讯云短信控制台](https://console.cloud.tencent.com/smsv2)，打开左侧菜单里的**应用管理**-**应用列表**，点击**创建应用**，应用名称可以为你的小程序名称+云开发，便于区分管理。创建后，会有一个SDKAppID。

    - cloudfunctions/functions/dosendsms/index.js 第32行
    - cloudfunctions/functions/dosendsms/index.js 第34行 修改签名

- 前往[腾讯验证码官网](https://console.cloud.tencent.com/captcha)创建验证码应用，获得aid和AppSecretKey；并打开cloudfunctions/functions/sendsms/index.js，在第3行TCaptchaID中填充自己项目的aid和AppSecretKey；另外在webviews/index.html大约49行，id为**TencentCaptcha**的button元素，将属性**data-appid**填写为【应用验证码aid】。

- 前往[静态网站控制台](https://console.cloud.tencent.com/tcb/hosting)-设置，复制域名信息下的默认域名；粘贴至cloudfunctions/functions/sendsms/index.js第10行AllowOriginList数组中第1项。

##### 四、NPM依赖配置安装
- 确定本机已经安装了nodejs和npm，如果没有安装请自行下载安装
- 命令行进入cloudfunctions/functions下的每个文件目录，每个目录均执行一遍以下代码：
``` bash
$ npm install
```

##### 五、上传并部署云函数

- 使用CloudBase CLI工具登录后，进入cloudfunctions/目录，依次执行以下代码：
**注意：envID 替换成自己的云开发环境ID**
``` bash
$ cloudbase functions:deploy -e envID sendsms
$ cloudbase functions:deploy -e envID dosendsms
$ cloudbase service:create -e envID -p /sendsms -f sendsms
```
- 上面最后一行是为 sendsms云函数创建HTTP服务

##### 六、部署静态网站服务

- 使用CloudBase CLI工具登录后，进入根目录，依次执行以下代码：
**注意：envID 替换成自己的云开发环境ID**
``` bash
$ cloudbase hosting:deploy -e envID webviews
```

到这里，整个项目就部署完毕，你可以访问静态网站服务默认域名访问使用了。如果你要对外使用，需要将域名换成自己已经备案的域名。

### 自定义域名

云开发提供了完备的web端资源服务，但是一个对外公开使用的web项目需要有自己的备案域名，需要受到监管。**所以，在正式对外推出之前，需要将云开发提供的默认域名替换成自己已经备案的域名**

- 前往[静态网站控制台](https://console.cloud.tencent.com/tcb/hosting)-设置，在【域名信息】下点击[添加域名]()按钮，填写已经备案的域名。域名需要配有SSL证书，腾讯云下域名会自动监测证书；如果是非腾讯云旗下域名，则需要上传SSL证书。

- 需要等待域名添加状态为【已启动】后，才可以去域名解析中配置CNAME。

- 前往[用户管理控制台](https://console.cloud.tencent.com/tcb/user)-登录设置，在WEB安全域名中删除云开发的默认域名，只保留自定义域名。

- cloudfunctions/functions/sendsms/index.js第10行AllowOriginList数组中，将默认域名更换成自定义域名，保存；使用CloudBase CLI到cloudfunctions目录下，执行下面代码更新：
**注意：envID 替换成自己的云开发环境ID**
``` bash
$ cloudbase functions:code:update -e envID sendsms
```

### 其他说明

- 为了全面展示腾讯云云开发的各项能力，有些地方代码不自然，可以根据自己的技术水准做升级
- 此项目为云开发原生JS-Demo，所以任何框架和库都没用。
- 代码模板源自作者[Zira](https://github.com/wasfzxt)
