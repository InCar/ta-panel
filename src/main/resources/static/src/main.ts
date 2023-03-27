import { createApp } from "vue";
import router from './router/index'
// import axios from 'axios'
import "@/assets/scss/style.scss";
import "@/assets/scss/element.scss";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import pinia from './store/index'
import { ElMessage } from 'element-plus'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus);

app.use(router)
app.use(pinia)
app.mount("#app")
// app.config.globalProperties.$axios = axios // 全局挂载
