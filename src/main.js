import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'


Vue.use(ElementUI);
// 配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

// 配置请求头 token
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios
Vue.prototype.$message = ElementUI.Message
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
