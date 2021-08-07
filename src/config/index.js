/* 
*环境配置
*/
const env = import.meta.env.MODE;
const EnvConfig = {
    dev: {
        baseApi: '/v1',
        // mockApi: 'https://www.fastmock.site/mock/b524a220e30379bd9409943f1df30493/dev',//my
        mockApi: 'https://www.fastmock.site/mock/b524a220e30379bd9409943f1df30493/dev'//teacher
    },
    test: {
        baseApi: '/v1',
        mockApi: 'https://www.fastmock.site/mock/b524a220e30379bd9409943f1df30493/dev'
    },
    prod: {
        baseApi: '/v1',
        mockApi: 'https://www.fastmock.site/mock/b524a220e30379bd9409943f1df30493/dev'
    }
}

export default {
    env,
    namespace:'_manage',
    mock: false,
    ...EnvConfig[env]
}