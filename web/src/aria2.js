// a simple module provides aria2 supports

import Aria2 from 'aria2'

const KEY_ARIA2_RPC_HOST = 'ARIA2_RPC_HOST'
const KEY_ARIA2_RPC_PORT = 'ARIA2_RPC_PORT'
const KEY_ARIA2_RPC_PATH = 'ARIA2_RPC_PATH'
const KEY_ARIA2_RPC_TOKEN = 'ARIA2_RPC_TOKEN'
const KEY_ARIA2_DOWNLOAD_PATH = 'ARIA2_DOWNLOAD_PATH'

function getStringFromLocalStorage(key, defaultValue) {
	return localStorage.getItem(key) || defaultValue
}

function setStringToLocalStorage(key, value) {
	return localStorage.setItem(key, value)
}

const aria2Support = {
	aria2: null,
	getRpcHost: function() {
		return getStringFromLocalStorage(KEY_ARIA2_RPC_HOST)
	},
	setRpcHost: function(host) {
		return setStringToLocalStorage(KEY_ARIA2_RPC_HOST, host)
	},
	getRpcPort: function() {
		let port = getStringFromLocalStorage(KEY_ARIA2_RPC_PORT)
		if (!port) {
			port = 6800
		}
		return port
	},
	setRpcPort: function(port) {
		if (Number.isNaN(Number(port))) {
			return false
		}

		return setStringToLocalStorage(KEY_ARIA2_RPC_PORT, port)
	},
	getRpcPath: function() {
		return getStringFromLocalStorage(KEY_ARIA2_RPC_PATH, '/jsonrpc')
	},
	setRpcPath: function(path) {
		return setStringToLocalStorage(KEY_ARIA2_RPC_PATH, path)
	},
	getRpcToken: function() {
		return getStringFromLocalStorage(KEY_ARIA2_RPC_TOKEN)
	},
	setRpcToken: function(token) {
		return setStringToLocalStorage(KEY_ARIA2_RPC_TOKEN, token)
	},
	getDownloadPath: function() {
		return getStringFromLocalStorage(KEY_ARIA2_DOWNLOAD_PATH)
	},
	setDownloadPath: function(path) {
		return setStringToLocalStorage(KEY_ARIA2_DOWNLOAD_PATH, path)
	},
	prepare: function() {
		if (this.aria2) {
			return
		}

		const options = {
			host: this.getRpcHost(),
			port: this.getRpcPort(),
			secure: false,
			secret: this.getRpcToken(),
			path: this.getRpcPath()
		}
		this.aria2 = new Aria2(options)
	},
	test: async function() {
		if (!this.aria2) {
			this.prepare()
		}

		return await this.aria2.call('getVersion')
	},
	addDownload: async function(url, downloadPath) {
		if (!this.aria2) {
			this.prepare()
		}
		const option = {
			dir: downloadPath
		}

		return await this.aria2.call('addUri', [url], option)
	}
}

export default aria2Support
