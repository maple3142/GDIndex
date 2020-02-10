import './style.css'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import PortalVue from 'portal-vue'
import GAuth from 'vue-google-oauth2'

Vue.config.productionTip = false

Vue.use(PortalVue)
Vue.use(GAuth, { 
	clientId: '192707836959-b5k3bvphbtovlqtuqj6155edlnsvra6o.apps.googleusercontent.com', 
	clientSecret: 'HXbR1yxb887WhMJ9vgPC-zol', 
	scope: 'email', 
	prompt: 'select_account', 
	fetch_basic_profile: false 
})

window.app = new Vue({
	vuetify,
	render: h => h(App)
}).$mount('#app')
