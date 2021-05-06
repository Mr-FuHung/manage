/* 
*环境配置
*/
const env = import.meta.env.MODE || 'prod';
const EnvConfig = {
    dev: {
        baseApi: '/',
        mockApi: 'https://www.fastmock.site/mock/b524a220e30379bd9409943f1df30493/dev'
    },
    test: {
        baseApi: '/',
        mockApi: 'https://www.fastmock.site/mock/b524a220e30379bd9409943f1df30493/dev'
    },
    prod: {
        baseApi: '/',
        mockApi: 'https://www.fastmock.site/mock/b524a220e30379bd9409943f1df30493/dev'
    }
}

export default {
    env,
    namespace:'_manage',
    mock: true,
    ...EnvConfig[env]
}