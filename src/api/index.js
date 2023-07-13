import axios from 'axios'

const api = axios.create({
    baseURL:"http://localhost:8080",
    timeout: 5000 // 5秒钟
})

export default api
