import './style.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import PortalVue from 'portal-vue'

Vue.use(PortalVue)

Vue.config.productionTip = false

window.app = new Vue({
	router,
	vuetify,
	i18n,
	render: h => h(App, { props: window.props })
}).$mount('#app')
