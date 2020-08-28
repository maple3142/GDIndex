const express = require('express')
const bodyParser = require('body-parser')
const xf = require('xfetch-js')

const app = express()
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})
function replace(t, a, b) {
	const reg = new RegExp(String.raw`(${a}: \').*?(\')`)
	return t.replace(reg, '$1' + b + '$2')
}
app.post('/getcode', async (req, res) => {
	const p = req.body
	const r = await xf
		.post('https://www.googleapis.com/oauth2/v4/token', {
			urlencoded: {
				code: p.auth_code,
				client_id: '202264815644.apps.googleusercontent.com',
				client_secret: 'X4Z3ca8xfWDb1Voo-F9a7ZxJ',
				redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
				grant_type: 'authorization_code'
			}
		})
		.json()
		.catch(e => null)
	if (r === null) {
		return res
			.status(400)
			.send(
				"Authorization Code is invalid. Perhaps it doesn's exists or it has been used for 1 time."
			)
	}
	let code = await xf
		.get(
			'https://raw.githubusercontent.com/maple3142/GDIndex/master/worker/dist/worker.js'
		)
		.text()
	code = replace(code, 'refresh_token', r.refresh_token)
	for (const [k, v] of Object.entries(p)) {
		code = replace(code, k, v)
	}
	if (p.auth) {
		code = code.replace('auth: false', 'auth: true')
	}
	if (p.upload) {
		code = code.replace('upload: false', 'upload: true')
	}
	res.set('Content-Type', 'text/javascript; charset=utf-8')
	res.send(code)
})
app.listen(process.env.PORT)
