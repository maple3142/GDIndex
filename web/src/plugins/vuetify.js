import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import i18n from '../i18n'

Vue.use(Vuetify)

export default new Vuetify({
	icons: {
		iconfont: 'md'
	},
	lang: {
		t: (key, ...params) => i18n.t(key, params)
	}
})
