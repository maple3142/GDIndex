import './style.css'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import PortalVue from 'portal-vue'

Vue.use(PortalVue)

Vue.config.productionTip = false

window.app = new Vue({
	vuetify,
	render: h => h(App, { props: window.props })
}).$mount('#app')
