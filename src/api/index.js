import axios from 'axios'

const api = axios.create({
    baseURL:"",
    timeout: 5000 // 5秒钟
})

export default api
