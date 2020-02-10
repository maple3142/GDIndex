module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/alpha-line-test.github.io/' : '/',
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
