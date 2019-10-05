const pathToRegexp = require('path-to-regexp')

class Router {
	constructor() {
		this.handlers = []
	}
	use(handler) {
		this.handlers.push(handler)
		return this
	}
	useRoute(path, handler) {
		const keys = []
		const re = pathToRegexp(path, keys)
		this.use(async (req, res, next) => {
			if (re.test(req.pathname)) {
				const [_, ...result] = re.exec(req.pathname)
				const params = {}
				for (let i = 0; i < result.length; i++) {
					params[keys[i].name] = result[i]
				}
				req.params = params
				await handler(req, res, next)
			}
		})
		return this
	}
	useRouteWithVerb(verb, path, handler) {
		verb = verb.toUpperCase()
		this.useRoute(path, async (req, res, next) => {
			if (req.method === verb) {
				await handler(req, res, next)
			}
		})
		return this
	}
	useWithVerb(verb, handler) {
		verb = verb.toUpperCase()
		this.use(async (req, res, next) => {
			if (req.method === verb) {
				await handler(req, res, next)
			}
		})
		return this
	}
	async handle(request) {
		const responseCtx = {
			body: '',
			headers: {}
		}
		const requestCtx = Object.assign({}, request, new URL(request.url))
		const createNext = n => async () => {
			const fn = this.handlers[n]
			if (!fn) return
			let gotCalled = false
			const next = createNext(n + 1)
			await fn(requestCtx, responseCtx, () => {
				gotCalled = true
				return next()
			})
			if (!gotCalled) {
				return next()
			}
		}
		await createNext(0)()
		return responseCtx.response ? responseCtx.response : new Response(responseCtx.body, responseCtx)
	}
}
for (const verb of ['get', 'post', 'delete', 'put', 'options', 'head']) {
	Router.prototype[verb] = function(path, handler) {
		if (handler) this.useRouteWithVerb(verb, path, handler)
		else this.useWithVerb(verb, path) // when there is only 1 argument, path is handler
		return this
	}
}
module.exports = Router
