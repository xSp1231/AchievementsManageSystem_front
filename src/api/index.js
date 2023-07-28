import axios from 'axios'

const api = axios.create({
    baseURL:"http://localhost:8080",
    timeout: 5000 // 5秒钟
})

// 添加请求拦截器
//// 在请求发送之前做一些处理，例如添加请求头等
api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('saToken');

        config.headers.set(sessionStorage.getItem('tokenName'),sessionStorage.getItem('saToken'))
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh-----------tokrn is",token)
       // config.headers['satoken'] = token;
    return config;
});

export default api
