class GoogleDrive {
	constructor(authConfig) {
		this.authConfig = authConfig
		this.paths = []
		this.files = []
		this.paths['/'] = authConfig.root
		this.accessToken()
	}

	async download(id, range = '') {
		let url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`
		let requestOption = await this.requestOption()
		requestOption.headers['Range'] = range
		return fetch(url, requestOption)
	}

	async file(path) {
		if (typeof this.files[path] == 'undefined') {
			this.files[path] = await this._file(path)
		}
		return this.files[path]
	}

	async _file(path) {
		let arr = path.split('/')
		let name = arr.pop()
		name = decodeURIComponent(name).replace(/\'/g, "\\'")
		let dir = arr.join('/') + '/'
		let parent = await this.findPathId(dir)
		let url = 'https://www.googleapis.com/drive/v3/files'
		let params = { includeItemsFromAllDrives: true, supportsAllDrives: true }
		params.q = `'${parent}' in parents and name = '${name}' andtrashed = false`
		params.fields = 'files(id, name, mimeType, size ,createdTime, modifiedTime, iconLink, thumbnailLink)'
		url += '?' + this.enQuery(params)
		let requestOption = await this.requestOption()
		let response = await fetch(url, requestOption)
		let obj = await response.json()
		return obj.files[0]
	}

	async list(path) {
		let id = await this.findPathId(path)
		return this._ls(id)
	}

	async _ls(parent) {
		if (parent == undefined) {
			return null
		}
		let url = 'https://www.googleapis.com/drive/v3/files'
		let params = { includeItemsFromAllDrives: true, supportsAllDrives: true }
		params.q = `'${parent}' in parents and trashed = false`
		params.orderBy = 'folder,name,modifiedTime desc'
		params.fields = 'nextPageToken, files(id, name, mimeType, size , modifiedTime)'
		params.pageSize = 1000
		url += '?' + this.enQuery(params)
		let requestOption = await this.requestOption()
		let response = await fetch(url, requestOption)
		let obj = await response.json()
		return obj
	}

	async findPathId(path) {
		let c_path = '/'
		let c_id = this.paths[c_path]

		let arr = path.split('/').filter(x => x)
		for (let name of arr) {
			c_path += name + '/'

			if (typeof this.paths[c_path] == 'undefined') {
				let id = await this._findDirId(c_id, name)
				this.paths[c_path] = id
			}

			c_id = this.paths[c_path]
			if (c_id == undefined || c_id == null) {
				break
			}
		}
		return this.paths[path]
	}

	async _findDirId(parent, name) {
		name = decodeURIComponent(name).replace(/\'/g, "\\'")

		if (parent == undefined) {
			return null
		}

		let url = 'https://www.googleapis.com/drive/v3/files'
		let params = { includeItemsFromAllDrives: true, supportsAllDrives: true }
		params.q = `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${name}'  and trashed = false`
		params.fields = 'nextPageToken, files(id, name, mimeType)'
		url += '?' + this.enQuery(params)
		let requestOption = await this.requestOption()
		let response = await fetch(url, requestOption)
		let obj = await response.json()
		if (obj.files[0] == undefined) {
			return null
		}
		return obj.files[0].id
	}

	async accessToken() {
		if (this.authConfig.expires == undefined || this.authConfig.expires < Date.now()) {
			const obj = await this.fetchAccessToken()
			if (obj.access_token != undefined) {
				this.authConfig.accessToken = obj.access_token
				this.authConfig.expires = Date.now() + 3500 * 1000
			}
		}
		return this.authConfig.accessToken
	}

	async fetchAccessToken() {
		const url = 'https://www.googleapis.com/oauth2/v4/token'
		const headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
		const post_data = {
			client_id: this.authConfig.client_id,
			client_secret: this.authConfig.client_secret,
			refresh_token: this.authConfig.refresh_token,
			grant_type: 'refresh_token'
		}

		let requestOption = {
			method: 'POST',
			headers: headers,
			body: this.enQuery(post_data)
		}

		const response = await fetch(url, requestOption)
		return await response.json()
	}

	async fetch200(url, requestOption) {
		let response
		for (let i = 0; i < 3; i++) {
			response = await fetch(url, requestOption)
			if (response.status != 403) {
				break
			}
			await this.sleep(800 * (i + 1))
		}
		return response
	}

	async requestOption(headers = {}, method = 'GET') {
		const accessToken = await this.accessToken()
		headers['authorization'] = 'Bearer ' + accessToken
		return { method: method, headers: headers }
	}

	enQuery(data) {
		const ret = []
		for (let d in data) {
			ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
		}
		return ret.join('&')
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}
module.exports = GoogleDrive
