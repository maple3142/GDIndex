self.props = {
	title: 'GDIndex',
	defaultRootId: '0AGeHrEz5q-XLUk9PVA',
	client_id: '202264815644.apps.googleusercontent.com',
	client_secret: 'X4Z3ca8xfWDb1Voo-F9a7ZxJ',
	refresh_token: ''
}
!(function(e) {
	var t = {}
	function s(n) {
		if (t[n]) return t[n].exports
		var r = (t[n] = { i: n, l: !1, exports: {} })
		return e[n].call(r.exports, r, r.exports, s), (r.l = !0), r.exports
	}
	;(s.m = e),
		(s.c = t),
		(s.d = function(e, t, n) {
			s.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n })
		}),
		(s.r = function(e) {
			'undefined' != typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
				Object.defineProperty(e, '__esModule', { value: !0 })
		}),
		(s.t = function(e, t) {
			if ((1 & t && (e = s(e)), 8 & t)) return e
			if (4 & t && 'object' == typeof e && e && e.__esModule) return e
			var n = Object.create(null)
			if (
				(s.r(n),
				Object.defineProperty(n, 'default', { enumerable: !0, value: e }),
				2 & t && 'string' != typeof e)
			)
				for (var r in e)
					s.d(
						n,
						r,
						function(t) {
							return e[t]
						}.bind(null, r)
					)
			return n
		}),
		(s.n = function(e) {
			var t =
				e && e.__esModule
					? function() {
							return e.default
					  }
					: function() {
							return e
					  }
			return s.d(t, 'a', t), t
		}),
		(s.o = function(e, t) {
			return Object.prototype.hasOwnProperty.call(e, t)
		}),
		(s.p = ''),
		s((s.s = 0))
})([
	function(e, t, s) {
		const n = new (s(1))(self.props),
			r = `<!DOCTYPE html><html lang=en><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=viewport content="width=device-width,initial-scale=1"><title>${props.title}</title><link href="/~_~_gdindex.css" rel=stylesheet></head><body><script>window.props = { title: '${props.title}', defaultRootId: '${props.defaultRootId}' }<\/script><div id=app></div><script src="/~_~_gdindex.js"><\/script></body></html>`
		async function o(e) {
			let t
			t =
				'GET' === (e = Object.assign({}, e, new URL(e.url))).method
					? await (async function(e) {
							let { pathname: t } = e
							t = decodeURIComponent(t)
							const s = e.searchParams.get('rootId') || self.props.defaultRootId
							if ('/~_~_gdindex.js' === t)
								return fetch(
									'https://raw.githubusercontent.com/maple3142/GDIndex/master/web/dist/js/app.js',
									{ headers: { 'Content-Type': 'text/javascript; charset=utf-8' } }
								)
							if ('/~_~_gdindex.css' === t)
								return fetch(
									'https://raw.githubusercontent.com/maple3142/GDIndex/master/web/dist/css/app.css',
									{ headers: { 'Content-Type': 'text/css; charset=utf-8' } }
								)
							if ('/' === t.substr(-1))
								return new Response(r, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
							{
								const r = await n.getMetaByPath(t, s)
								return r
									? r.mimeType.includes('vnd.google-apps')
										? Response.redirect(r.webViewLink, 302)
										: n.download(r.id, e.headers.get('Range'))
									: new Response('null', {
											headers: { 'Content-Type': 'application/json' },
											status: 404
									  })
							}
					  })(e)
					: 'POST' === e.method
					? await (async function(e) {
							let { pathname: t } = e
							t = decodeURIComponent(t)
							const s = e.searchParams.get('rootId') || self.props.defaultRootId
							if ('/~_~_gdindex/drives' === t)
								return new Response(JSON.stringify(await n.listDrive()), {
									headers: { 'Content-Type': 'application/json' }
								})
							if ('/' === t.substr(-1))
								return new Response(JSON.stringify(await n.listFolderByPath(t, s)), {
									headers: { 'Content-Type': 'application/json' }
								})
							{
								const r = await n.getMetaByPath(t, s)
								return r
									? r.mimeType.includes('vnd.google-apps')
										? Response.redirect(r.webViewLink, 302)
										: n.download(r.id, e.headers.get('Range'))
									: new Response('null', {
											headers: { 'Content-Type': 'application/json' },
											status: 404
									  })
							}
					  })(e)
					: new Response('', { status: 405 })
			const s = Object.create(null)
			for (const [e, n] of t.headers.entries()) s[e] = n
			return new Response(t.body, {
				status: t.status,
				statusText: t.statusText,
				headers: Object.assign(s, { 'Access-Control-Allow-Origin': '*' })
			})
		}
		addEventListener('fetch', e => {
			e.respondWith(
				o(e.request).catch(e => {
					console.error(e),
						new Response(JSON.stringify(e.stack), {
							status: 500,
							headers: { 'Content-Type': 'application/json' }
						})
				})
			)
		})
	},
	function(e, t, s) {
		const n = s(2)
		e.exports = class {
			constructor(e) {
				;(this.auth = e), (this.expires = 0), (this._getIdCache = new Map())
			}
			async initializeClient() {
				if (Date.now() < this.expires) return
				const e = await n
					.post('https://www.googleapis.com/oauth2/v4/token', {
						urlencoded: {
							client_id: this.auth.client_id,
							client_secret: this.auth.client_secret,
							refresh_token: this.auth.refresh_token,
							grant_type: 'refresh_token'
						}
					})
					.json()
				;(this.client = n.extend({
					baseURI: 'https://www.googleapis.com/drive/v3/',
					headers: { Authorization: `Bearer ${e.access_token}` }
				})),
					(this.expires = Date.now() + 35e5)
			}
			async listDrive() {
				return await this.initializeClient(), this.client.get('drives').json()
			}
			async download(e, t = '') {
				return (
					await this.initializeClient(),
					this.client.get(`files/${e}`, {
						qs: { includeItemsFromAllDrives: !0, supportsAllDrives: !0, alt: 'media' },
						headers: { Range: t }
					})
				)
			}
			async downloadByPath(e, t = 'root', s = '') {
				const n = await this.getId(e, t)
				return n ? this.download(n, s) : null
			}
			async getMeta(e) {
				return (
					await this.initializeClient(),
					this.client
						.get(`files/${e}`, {
							qs: { includeItemsFromAllDrives: !0, supportsAllDrives: !0, fields: '*' }
						})
						.json()
				)
			}
			async getMetaByPath(e, t = 'root') {
				const s = await this.getId(e, t)
				return s ? this.getMeta(s) : null
			}
			async listFolder(e) {
				return (
					await this.initializeClient(),
					await this.client
						.get('files', {
							qs: {
								includeItemsFromAllDrives: !0,
								supportsAllDrives: !0,
								q: `'${e}' in parents and trashed = false`,
								orderBy: 'folder,name,modifiedTime desc',
								fields: 'files(id, name, mimeType, size, modifiedTime)',
								pageSize: 1e3
							}
						})
						.json()
				)
			}
			async listFolderByPath(e, t = 'root') {
				const s = await this.getId(e, t)
				return s ? this.listFolder(s) : null
			}
			async getId(e, t = 'root') {
				const s = e.split('/').filter(Boolean)
				let n = t
				for (const e of s) n = await this._getId(n, e)
				return n
			}
			async _getId(e, t) {
				if (this._getIdCache.has(e + t)) return this._getIdCache.get(e + t)
				await this.initializeClient(), (t = t.replace(/\'/g, "\\'"))
				const s = await this.client
					.get('files', {
						qs: {
							includeItemsFromAllDrives: !0,
							supportsAllDrives: !0,
							q: `'${e}' in parents and name = '${t}'  and trashed = false`,
							fields: 'files(id)'
						}
					})
					.json()
					.catch(e => ({ files: [] }))
				return 1 !== s.files.length ? null : (this._getIdCache.has(e + t), s.files[0].id)
			}
		}
	},
	function(e, t, s) {
		var n, r, o
		;(r = []),
			void 0 ===
				(o =
					'function' ==
					typeof (n = () => {
						const e = ['get', 'post', 'put', 'patch', 'delete', 'head']
						class t extends Error {
							constructor(e) {
								super(e.statusText), (this.name = 'HTTPError'), (this.response = e)
							}
						}
						class s extends Promise {}
						for (const e of ['arrayBuffer', 'blob', 'formData', 'json', 'text'])
							s.prototype[e] = function(t) {
								return this.then(t => t[e]()).then(t || (e => e))
							}
						const { assign: n } = Object,
							r = e => e.reduce((e, [t, s]) => ((e[t] = s), e), {}),
							o = (...e) => t => e.some(e => ('string' == typeof e ? typeof t === e : t instanceof e)),
							i = o('string'),
							a = o('object'),
							l = e => {
								if (!e.ok) throw new t(e)
								return e
							},
							d = (c = {}) => {
								const p = (e, t = {}) => {
									n(t, c)
									const d = e => new t.URLSearchParams(e).toString(),
										p = new t.URL(e, t.baseURI || void 0)
									if (
										(t.headers
											? o(t.Headers)(t.headers) && (t.headers = r([...t.headers.entries()]))
											: (t.headers = {}),
										t.json)
									)
										(t.body = JSON.stringify(t.json)),
											(t.headers['Content-Type'] = 'application/json')
									else if ((e => i(e) || a(e))(t.urlencoded))
										(t.body = i(t.urlencoded) ? t.urlencoded : d(t.urlencoded)),
											(t.headers['Content-Type'] = 'application/x-www-form-urlencoded')
									else if (o(t.FormData, 'object')(t.formData)) {
										if (!o(t.FormData)(t.formData)) {
											const e = new t.FormData()
											for (const [s, n] of Object.entries(t.formData)) e.append(s, n)
											t.formData = e
										}
										t.body = t.formData
									}
									return (
										t.qs &&
											(i(t.qs) &&
												(t.qs = (e => r([...new t.URLSearchParams(e).entries()]))(t.qs)),
											(p.search = d(n(r([...p.searchParams.entries()]), t.qs)))),
										s.resolve(t.fetch(p, t).then(l))
									)
								}
								for (const t of e) p[t] = (e, s = {}) => ((s.method = t.toUpperCase()), p(e, s))
								return (p.extend = e => d(n({}, c, e))), (p.HTTPError = t), p
							},
							c = 'undefined' != typeof document
						return 'undefined' != typeof self
							? d({
									fetch: fetch.bind(self),
									URL: URL,
									Response: Response,
									URLSearchParams: URLSearchParams,
									Headers: Headers,
									FormData: FormData,
									baseURI: c ? document.baseURI : ''
							  })
							: d()
					})
						? n.apply(t, r)
						: n) || (e.exports = o)
	}
])
