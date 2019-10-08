module.exports = {
	input: 'index.js',
	output: {
		dir: 'dist',
		fileName: 'worker.js',
		format: 'iife'
	},
	minify: false,
	target: 'browser',
	banner: `
self.props = {
	title: 'GDIndex',
	default_root_id: 'root',
	client_id: '202264815644.apps.googleusercontent.com',
	client_secret: 'X4Z3ca8xfWDb1Voo-F9a7ZxJ',
	refresh_token: '',
	auth: false,
	user: '',
	pass: '',
	upload: false
};`.slice(1)
}
