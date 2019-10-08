import './style.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import PortalVue from 'portal-vue'

if (window.props.defaultRootId) {
	// backward compability
	window.props.default_root_id = window.props.defaultRootId
}

Vue.use(PortalVue)

Vue.config.productionTip = false

window.app = new Vue({
	router,
	vuetify,
	i18n,
	render: h => h(App, { props: window.props })
}).$mount('#app')
