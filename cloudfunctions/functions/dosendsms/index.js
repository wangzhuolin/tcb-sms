const tcb = require("tcb-admin-node");
const tencentcloud = require("tencentcloud-sdk-nodejs");

const smsClient = tencentcloud.sms.v20190711.Client;
const models = tencentcloud.sms.v20190711.Models
const Credential = tencentcloud.common.Credential

//腾讯云访问密钥的[API密钥管理](https://console.cloud.tencent.com/cam/capi)
const CamID = {
    SecretId: 'xxxxxxx',
    SecretKey: 'xxxxxxxx'
}

/**
 * 发送短信
 * 
 * @param {object} params 
 */
function sendSms(params) {
    const {
        phone,
        tplid,
        name
    } = params


    const cred = new Credential(CamID.SecretId,CamID.SecretKey)
    const client = new smsClient(cred, "ap-guangzhou")

    const req = new models.SendSmsRequest()
    /* 短信应用ID: 短信SdkAppid在 [短信控制台] 添加应用后生成的实际SdkAppid，示例如1400006666 */
    req.SmsSdkAppid = "xxxxx"
    /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名，签名信息可登录 [短信控制台] 查看 */
    req.Sign = "xxxxxx"
    /* 短信码号扩展号: 默认未开通，如需开通请联系 [sms helper] */
    req.ExtendCode = ""
    /* 国际/港澳台短信 senderid: 国内短信填空，默认未开通，如需开通请联系 [sms helper] */
    req.SenderId = ""
    /* 用户的 session 内容: 可以携带用户侧 ID 等上下文信息，server 会原样返回 */
    req.SessionContext = ""
    /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
    * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
    req.PhoneNumberSet = [`+86${phone}`]
    /* 模板 ID: 必须填写已审核通过的模板 ID。模板ID可登录 [短信控制台] 查看 */
    req.TemplateID = tplid
    /* 模板参数: 若无模板参数，则设置为空*/
    req.TemplateParamSet = [name]

    return new Promise((resolve, reject) => {
        client.SendSms(req, (err, res) => {
            console.log('>>> sms err is', err)
            console.log('>>> sms res is', res)

            if (err) {
                err.code = 'SMS_REQUEST_FAIL'
                return reject(err)
            }

            const json = JSON.parse(res.to_json_string())
            if (json.SendStatusSet[0].Code.toLowerCase() === 'ok') {
                return resolve()
            }

            const error = new Error(json.SendStatusSet[0].Message)
            error.code = json.SendStatusSet[0].Code
            return reject(error)
        })
    })
}

tcb.init();
exports.main = async event => {
    let result = {};
    console.log(event);
    try{
        await sendSms(event)
        result.code = 0;
    }
    catch(e){
        console.log(e);
        result.code = -1;
        result.err = e;
    }
    return result;
};