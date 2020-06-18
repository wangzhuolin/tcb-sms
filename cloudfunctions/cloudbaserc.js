module.exports = {
    envId: '云开发环境ID',
    functionRoot: './functions',
    functions: [
        {
            name: 'sendsms',
            config: {
                // 超时时间
                timeout: 60,
                // 环境变量
                envVariables: {},
                runtime: 'Nodejs8.9'
            },
            handler: 'index.main'
        },{
            name: 'dosendsms',
            config: {
                // 超时时间
                timeout: 60,
                // 环境变量
                envVariables: {},
                runtime: 'Nodejs8.9'
            },
            handler: 'index.main'
        }
    ]
}
