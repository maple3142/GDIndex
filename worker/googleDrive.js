import xf from './xfetch'

class GoogleDrive {
	constructor(auth) {
		this.auth = auth
		this.expires = 0
		this._getIdCache = new Map()
	}
	async initializeClient() {
		// any method that do api call must call this beforehand
		if (Date.now() < this.expires) return
		const resp = await xf
			.post('https://www.googleapis.com/oauth2/v4/token', {
				urlencoded: {
					client_id: this.auth.client_id,
					client_secret: this.auth.client_secret,
					refresh_token: this.auth.refresh_token,
					grant_type: 'refresh_token'
				}
			})
			.json()
		this.client = xf.extend({
			baseURI: 'https://www.googleapis.com/drive/v3/',
			headers: {
				Authorization: `Bearer ${resp.access_token}`
			}
		})
		this.expires = Date.now() + 3500 * 1000 // normally, it should expiers after 3600 seconds
	}
	async listDrive() {
		await this.initializeClient()
		return this.client.get('drives').json()
	}
	async download(id, range = '') {
		await this.initializeClient()
		return this.client.get(`files/${id}`, {
			qs: {
				includeItemsFromAllDrives: true,
				supportsAllDrives: true,
				alt: 'media'
			},
			headers: {
				Range: range
			}
		})
	}
	async downloadByPath(path, rootId = 'root', range = '') {
		const id = await this.getId(path, rootId)
		if (!id) return null
		return this.download(id, range)
	}
	async getMeta(id) {
		await this.initializeClient()
		return this.client
			.get(`files/${id}`, {
				qs: {
					includeItemsFromAllDrives: true,
					supportsAllDrives: true,
					fields: '*'
				}
			})
			.json()
	}
	async getMetaByPath(path, rootId = 'root') {
		const id = await this.getId(path, rootId)
		if (!id) return null
		return this.getMeta(id)
	}
	async listFolder(id) {
		await this.initializeClient()
		const getList = pageToken => {
			const qs = {
				includeItemsFromAllDrives: true,
				supportsAllDrives: true,
				q: `'${id}' in parents and trashed = false`,
				orderBy: 'folder,name,modifiedTime desc',
				fields:
					'files(id,name,mimeType,size,modifiedTime),nextPageToken',
				pageSize: 1000
			}
			if (pageToken) {
				qs.pageToken = pageToken
			}
			return this.client
				.get('files', {
					qs
				})
				.json()
		}
		const files = []
		let pageToken
		do {
			const resp = await getList(pageToken)
			files.push(...resp.files)
			pageToken = resp.nextPageToken
		} while (pageToken)
		return { files }
	}
	async listFolderByPath(path, rootId = 'root') {
		const id = await this.getId(path, rootId)
		if (!id) return null
		return this.listFolder(id)
	}
	async getId(path, rootId = 'root') {
		const toks = path.split('/').filter(Boolean)
		let id = rootId
		for (const tok of toks) {
			id = await this._getId(id, tok)
		}
		return id
	}
	async _getId(parentId, childName) {
		if (this._getIdCache.has(parentId + childName)) {
			return this._getIdCache.get(parentId + childName)
		}
		await this.initializeClient()
		childName = childName.replace(/\'/g, `\\'`) // escape single quote
		const resp = await this.client
			.get('files', {
				qs: {
					includeItemsFromAllDrives: true,
					supportsAllDrives: true,
					q: `'${parentId}' in parents and name = '${childName}'  and trashed = false`,
					fields: 'files(id)'
				}
			})
			.json()
			.catch(e => ({ files: [] })) // if error, make it empty
		if (resp.files.length === 0) {
			return null
		}
		this._getIdCache.has(parentId + childName)
		return resp.files[0].id // when there are more than 1 items, simply return the first one
	}
	async upload(parentId, name, file) {
		await this.initializeClient()
		const createResp = await this.client.post(
			'https://www.googleapis.com/upload/drive/v3/files',
			{
				qs: {
					uploadType: 'resumable',
					supportsAllDrives: true
				},
				json: {
					name,
					parents: [parentId]
				}
			}
		)
		const putUrl = createResp.headers.get('Location')
		return this.client
			.put(putUrl, {
				body: file
			})
			.json()
	}
	async uploadByPath(path, name, file, rootId = 'root') {
		const id = await this.getId(path, rootId)
		if (!id) return null
		return this.upload(id, name, file)
	}
	async delete(fileId) {
		return this.client.delete(`files/${fileId}`)
	}
	async deleteByPath(path, rootId = 'root') {
		const id = await this.getId(path, rootId)
		if (!id) return null
		return this.delete(id)
	}
}
export default GoogleDrive
