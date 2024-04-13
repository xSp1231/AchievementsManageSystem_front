import axios from 'axios'
import router from "../router/index.js"; //js文件中 直接使用实例
import {ElMessage} from "element-plus";
//为什么不能使用const router=useRouter()  因为useRouter只能在
const api = axios.create({
  //  baseURL: "http://8.137.112.197:8080",
   // baseURL: "http://8.137.9.219:8080",
    baseURL: "http://localhost:8080",
   //  baseURL: "http://149.88.75.178:8080",
    timeout: 5000 // 5秒钟
})
// 添加请求拦截器
//// 在请求发送之前做一些处理，例如添加请求头等
api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('saToken');
    config.headers.set(sessionStorage.getItem('tokenName'), sessionStorage.getItem('saToken'))
    return config;
});
//响应拦截器设置
api.interceptors.response.use(response => {
      console.log("前端响应拦截器 拦截到的后端数据是的response is ",response.data);
        if (response.data.message==='登录已经过期,请重新登录') {
            //清除satoken 为什么要清除呢 因为路由导航那里有限制
            sessionStorage.removeItem('saToken'); //会话存储里面
            sessionStorage.removeItem('tokenName');
            sessionStorage.removeItem('role');
            ElMessage('登录已经过期,请重新登录')
            router.push('/loginandregister') //回到登录页面
            return response
        } else {//如果已经登录了 那么就放行  将后端数据交给前端 所以 一定要return response
           return response;
        }
    },
    error => {
        console.log("error",response.data.code)
    },
)
export default api
