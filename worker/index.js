self.props = {
	title: 'GDIndex',
	defaultRootId: '0AGeHrEz5q-XLUk9PVA',
	client_id: '202264815644.apps.googleusercontent.com',
	client_secret: 'X4Z3ca8xfWDb1Voo-F9a7ZxJ',
	refresh_token: ''
}

const GoogleDrive = require('./googleDrive')

const gd = new GoogleDrive(self.props)

const HTML = `<!DOCTYPE html><html lang=en><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=viewport content="width=device-width,initial-scale=1"><title>${props.title}</title><link href="/~_~_gdindex.css" rel=stylesheet></head><body><script>window.props = { title: '${props.title}', defaultRootId: '${props.defaultRootId}' }</script><div id=app></div><script src="/~_~_gdindex.js"></script></body></html>`

async function onGet(request) {
	let { pathname: path } = request
	path = decodeURIComponent(path)
	const rootId = request.searchParams.get('rootId') || self.props.defaultRootId
	if (path === '/~_~_gdindex.js') {
		return fetch('https://raw.githubusercontent.com/maple3142/GDIndex/master/web/dist/js/app.js', {
			headers: {
				'Content-Type': 'text/javascript; charset=utf-8'
			}
		})
	} else if (path === '/~_~_gdindex.css') {
		return fetch('https://raw.githubusercontent.com/maple3142/GDIndex/master/web/dist/css/app.css', {
			headers: {
				'Content-Type': 'text/css; charset=utf-8'
			}
		})
	} else if (path.substr(-1) === '/') {
		return new Response(HTML, {
			headers: {
				'Content-Type': 'text/html; charset=utf-8'
			}
		})
	} else {
		const result = await gd.getMetaByPath(path, rootId)
		if (!result) {
			return new Response('null', {
				headers: {
					'Content-Type': 'application/json'
				},
				status: 404
			})
		}
		const isGoogleApps = result.mimeType.includes('vnd.google-apps')
		if (!isGoogleApps) {
			return gd.download(result.id, request.headers.get('Range'))
		} else {
			return Response.redirect(result.webViewLink, 302)
		}
	}
}
async function onPost(request) {
	let { pathname: path } = request
	path = decodeURIComponent(path)
	const rootId = request.searchParams.get('rootId') || self.props.defaultRootId
	if (path === '/~_~_gdindex/drives') {
		return new Response(JSON.stringify(await gd.listDrive()), {
			headers: {
				'Content-Type': 'application/json'
			}
		})
	} else if (path.substr(-1) === '/') {
		return new Response(JSON.stringify(await gd.listFolderByPath(path, rootId)), {
			headers: {
				'Content-Type': 'application/json'
			}
		})
	} else {
		const result = await gd.getMetaByPath(path, rootId)
		if (!result) {
			return new Response('null', {
				headers: {
					'Content-Type': 'application/json'
				},
				status: 404
			})
		}
		const isGoogleApps = result.mimeType.includes('vnd.google-apps')
		if (!isGoogleApps) {
			return gd.download(result.id, request.headers.get('Range'))
		} else {
			return Response.redirect(result.webViewLink, 302)
		}
	}
}

async function handleRequest(request) {
	request = Object.assign({}, request, new URL(request.url))
	let resp
	if (request.method === 'GET') resp = await onGet(request)
	else if (request.method === 'POST') resp = await onPost(request)
	else
		resp = new Response('', {
			status: 405
		})
	const obj = Object.create(null)
	for (const [k, v] of resp.headers.entries()) {
		obj[k] = v
	}
	return new Response(resp.body, {
		status: resp.status,
		statusText: resp.statusText,
		headers: Object.assign(obj, {
			'Access-Control-Allow-Origin': '*'
		})
	})
}

addEventListener('fetch', event => {
	event.respondWith(
		handleRequest(event.request).catch(err => {
			console.error(err)
			new Response(JSON.stringify(err.stack), {
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			})
		})
	)
})
