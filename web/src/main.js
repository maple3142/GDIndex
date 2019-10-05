import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './style.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'

Vue.config.productionTip = false

window.app = new Vue({
	router,
	vuetify,
	i18n,
	render: h => h(App, { props: window.props })
}).$mount('#app')
