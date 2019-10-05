module.exports = {
	pluginOptions: {
		i18n: {
			locale: 'en',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableInSFC: false
		}
	},
	filenameHashing: false,
	configureWebpack: {
		optimization: {
			splitChunks: false
		}
	}
}
