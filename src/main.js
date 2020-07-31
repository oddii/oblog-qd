import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css' //  element-ul css样式
import 'element-ui/lib/theme-chalk/display.css' //  断点隐藏样式
import './styles/element-ui.less' //  element-ui 自定义样式
import './styles/index.less' // 基础样式
import './styles/commen.less' //  共有样式

import mavonEditor from 'mavon-editor' //  引入 md 编辑器
import 'mavon-editor/dist/css/index.css' //  引入 md 编辑器样式

Vue.use(mavonEditor)

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
