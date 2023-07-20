import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from "./router/index.js";
import store from "./store/index.js";
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css' // 引入element plus 样式文件
const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
// 屏蔽控制台警告信息
app.config.warnHandler = () => null;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {  //应用所有图标
    app.component(key, component)
}

app.mount('#app')
