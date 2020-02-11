import './style.css'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import PortalVue from 'portal-vue'
import GAuth from 'vue-google-oauth2'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(PortalVue)
Vue.use(GAuth, { 
	clientId: '192707836959-b5k3bvphbtovlqtuqj6155edlnsvra6o.apps.googleusercontent.com', 
	clientSecret: 'HXbR1yxb887WhMJ9vgPC-zol', 
	scope: 'email', 
	prompt: 'select_account', 
	fetch_basic_profile: false 
})

const router = new VueRouter({
	mode: 'hash',
	routes: [
		{
			path: '/', 
			name: 'Auth',
			component: () => import('./views/Auth.vue')
		},
		{
			path: '/file_viewer', 
			name: 'FileViewer',
			component: () => import('./views/FileViewer.vue')
		}
	]
})

window.app = new Vue({
	router,
	vuetify,
	render: h => h(App)
}).$mount('#app')
