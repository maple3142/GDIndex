import mime from 'mime'
import GoogleDrive from './googleDrive'

const gd = new GoogleDrive(self.props)

const HTML = `<!DOCTYPE html><html lang=en><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=viewport content="width=device-width,initial-scale=1"><title>${self.props.title}</title><link href="/~_~_gdindex/resources/css/app.css" rel=stylesheet></head><body><script>window.props = { title: '${self.props.title}', default_root_id: '${self.props.default_root_id}', api: location.protocol + '//' + location.host, upload: ${self.props.upload} }<\/script><div id=app></div><script src="/~_~_gdindex/resources/js/app.js"><\/script></body></html>`

async function onGet(request) {
	let { pathname: path } = request
	const rootId =
		request.searchParams.get('rootId') || self.props.default_root_id
	if (path.startsWith('/~_~_gdindex/resources/')) {
		const remain = path.replace('/~_~_gdindex/resources/', '')
		const r = await fetch(
			`https://raw.githubusercontent.com/maple3142/GDIndex/master/web/dist/${remain}`
		)
		return new Response(r.body, {
			headers: {
				'Content-Type': mime.getType(remain) + '; charset=utf-8',
				'Cache-Control': 'max-age=600'
			}
		})
	} else if (path === '/~_~_gdindex/drives') {
		return new Response(JSON.stringify(await gd.listDrive()), {
			headers: {
				'Content-Type': 'application/json'
			}
		})
	} else if (path.substr(-1) === '/' || path.startsWith('/~viewer')) {
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
			const r = await gd.download(result.id, request.headers.get('Range'))
			const h = new Headers(r.headers)
			h.set(
				'Content-Disposition',
				`inline; filename*=UTF-8''${encodeURIComponent(result.name)}`
			)
			return new Response(r.body, {
				status: r.status,
				headers: h
			})
		} else {
			return Response.redirect(result.webViewLink, 302)
		}
	}
}
async function onPost(request) {
	let { pathname: path } = request
	const rootId =
		request.searchParams.get('rootId') || self.props.default_root_id
	if (path.substr(-1) === '/') {
		return new Response(
			JSON.stringify(await gd.listFolderByPath(path, rootId)),
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
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
			const r = await gd.download(result.id, request.headers.get('Range'))
			const h = new Headers(r.headers)
			h.set(
				'Content-Disposition',
				`inline; filename*=UTF-8''${encodeURIComponent(result.name)}`
			)
			return new Response(r.body, {
				status: r.status,
				headers: h
			})
		} else {
			return Response.redirect(result.webViewLink, 302)
		}
	}
}
async function onPut(request) {
	if (!self.props.upload) {
		return new Response("Upload isn't enabled.", {
			headers: {
				'Content-Type': 'text/plain'
			},
			status: 405
		})
	}
	let { pathname: path } = request
	if (path.substr(-1) === '/') {
		return new Response(null, {
			headers: {
				'Content-Type': 'application/json'
			},
			status: 405
		})
	}
	const url = request.searchParams.get('url')
	let fileBody
	if (url) {
		const u = new URL(url)
		const Referer = u.href
		const Origin = u.protocol + '//' + u.host
		fileBody = (
			await fetch(url, {
				headers: { Referer, Origin }
			})
		).body
	} else {
		fileBody = request.body
	}
	const tok = path.split('/')
	const name = tok.pop()
	const parent = tok.join('/')
	const rootId =
		request.searchParams.get('rootId') || self.props.default_root_id
	return new Response(
		JSON.stringify(await gd.uploadByPath(parent, name, fileBody, rootId)),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	)
}
function unauthorized() {
	return new Response('Unauthorized', {
		headers: {
			'WWW-Authenticate': 'Basic realm="goindex"',
			'Access-Control-Allow-Origin': '*'
		},
		status: 401
	})
}
function parseBasicAuth(auth) {
	try {
		return atob(auth.split(' ').pop()).split(':')
	} catch (e) {
		return []
	}
}
function doBasicAuth(request) {
	const auth = request.headers.get('Authorization')
	if (!auth || !/^Basic [A-Za-z0-9._~+/-]+=*$/i.test(auth)) {
		return false
	}
	const [user, pass] = parseBasicAuth(auth)
	return user === self.props.user && pass === self.props.pass
}
function encodePathComponent(path) {
	return path.split('/').map(encodeURIComponent).join('/')
}
async function handleRequest(request) {
	if (request.method === 'OPTIONS')
		// allow preflight request
		return new Response('', {
			status: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, HEAD, OPTIONS'
			}
		})
	if (self.props.auth && !doBasicAuth(request)) {
		return unauthorized()
	}
	request = Object.assign({}, request, new URL(request.url))
	request.pathname = request.pathname
		.split('/')
		.map(decodeURIComponent)
		.map(decodeURIComponent) // for some super special cases, browser will force encode it...   eg: +αあるふぁきゅん。 - +♂.mp3
		.join('/')

	if (self.props.lite && request.pathname.endsWith('/')) {
		// lite mode
		const path = request.pathname
		let parent = encodePathComponent(
			path.split('/').slice(0, -2).join('/') + '/'
		)
		const { files } = await gd.listFolderByPath(
			path,
			self.props.default_root_id
		)
		let fileht = ''
		for (const f of files) {
			const isf = f.mimeType === 'application/vnd.google-apps.folder'
			const p = encodePathComponent(path + f.name)
			fileht += `<li><a href="${p + (isf ? '/' : '')}">${f.name}</a></li>`
		}
		const ht = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<html>
<head>
<title>Index of ${path}</title>
</head>
<body>
<h1>Index of ${path}</h1>
<ul>
<li><a href="${parent}"> Parent Directory</a></li>
${fileht}
</ul>
</body>
</html>`
		return new Response(ht, {
			status: 200,
			headers: {
				'Content-Type': 'text/html; charset=utf-8'
			}
		})
	}

	let resp
	if (request.method === 'GET') resp = await onGet(request)
	else if (request.method === 'POST') resp = await onPost(request)
	else if (request.method === 'PUT') resp = await onPut(request)
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
