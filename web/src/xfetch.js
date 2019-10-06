/*
 * XFetch.js
 * A extremely simple fetch extension inspired by sindresorhus/ky.
 */
export default (() => {
	const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head']
	class HTTPError extends Error {
		constructor(res) {
			super(res.statusText)
			this.name = 'HTTPError'
			this.response = res
		}
	}
	class XResponsePromise extends Promise {}
	for (const alias of ['arrayBuffer', 'blob', 'formData', 'json', 'text']) {
		// alias for .json() .text() etc...
		XResponsePromise.prototype[alias] = function(fn) {
			return this.then(res => res[alias]()).then(fn || (x => x))
		}
	}
	function mergeDeep(target, source) {
		const isObject = obj => obj && typeof obj === 'object'

		if (!isObject(target) || !isObject(source)) {
			return source
		}

		Object.keys(source).forEach(key => {
			const targetValue = target[key]
			const sourceValue = source[key]

			if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
				target[key] = targetValue.concat(sourceValue)
			} else if (isObject(targetValue) && isObject(sourceValue)) {
				target[key] = mergeDeep(
					Object.assign({}, targetValue),
					sourceValue
				)
			} else {
				target[key] = sourceValue
			}
		})

		return target
	}
	const { assign } = Object
	const fromEntries = ent =>
		ent.reduce((acc, [k, v]) => ((acc[k] = v), acc), {})
	const typeis = (...types) => val =>
		types.some(type =>
			typeof type === 'string' ? typeof val === type : val instanceof type
		)
	const isstr = typeis('string')
	const isobj = typeis('object')
	const isstrorobj = v => isstr(v) || isobj(v)
	const responseErrorThrower = res => {
		if (!res.ok) throw new HTTPError(res)
		return res
	}
	const extend = (defaultInit = {}) => {
		const xfetch = (input, init = {}) => {
			mergeDeep(init, defaultInit)
			const createQueryString = o =>
				new init.URLSearchParams(o).toString()
			const parseQueryString = s =>
				fromEntries([...new init.URLSearchParams(s).entries()])
			const url = new init.URL(input, init.baseURI || undefined)
			if (!init.headers) {
				init.headers = {}
			} else if (typeis(init.Headers)(init.headers)) {
				// Transform into object if it is `Headers`
				init.headers = fromEntries([...init.headers.entries()])
			}
			// Add json or form on body
			if (init.json) {
				init.body = JSON.stringify(init.json)
				init.headers['Content-Type'] = 'application/json'
			} else if (isstrorobj(init.urlencoded)) {
				init.body = isstr(init.urlencoded)
					? init.urlencoded
					: createQueryString(init.urlencoded)
				init.headers['Content-Type'] =
					'application/x-www-form-urlencoded'
			} else if (typeis(init.FormData, 'object')(init.formData)) {
				// init.formData is data passed by user, init.FormData is FormData constructor
				if (!typeis(init.FormData)(init.formData)) {
					const fd = new init.FormData()
					for (const [k, v] of Object.entries(init.formData)) {
						fd.append(k, v)
					}
					init.formData = fd
				}
				init.body = init.formData
			}
			// Querystring
			if (init.qs) {
				if (isstr(init.qs)) init.qs = parseQueryString(init.qs)
				url.search = createQueryString(
					assign(
						fromEntries([...url.searchParams.entries()]),
						init.qs
					)
				)
			}
			// same-origin by default
			if (!init.credentials) {
				init.credentials = 'same-origin'
			}
			return XResponsePromise.resolve(
				init.fetch(url, init).then(responseErrorThrower)
			)
		}
		for (const method of METHODS) {
			xfetch[method] = (input, init = {}) => {
				init.method = method.toUpperCase()
				return xfetch(input, init)
			}
		}
		// Extra methods and classes
		xfetch.extend = newDefaultInit =>
			extend(assign({}, defaultInit, newDefaultInit))
		xfetch.HTTPError = HTTPError
		return xfetch
	}
	const isWindow = typeof document !== 'undefined'
	const isBrowser = typeof self !== 'undefined' // works in both window & worker scope
	return isBrowser
		? extend({
				fetch: fetch.bind(self),
				URL,
				Response,
				URLSearchParams,
				Headers,
				FormData,
				baseURI: isWindow ? document.baseURI : '' // since there is no document in webworkers
		  })
		: extend()
})()
