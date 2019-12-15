<template>
	<v-dialog v-model="show" :persistent="true" max-width="700">
		<template v-slot:activator="{ on }">
			<v-btn
				v-if="enabled"
				v-text="$t('aria2Download')"
				color="primary"
				@click="onShow"
				id="btn-show"
			></v-btn>
		</template>
		<v-card>
			<v-card-title class="headline">
				<span>{{ $t('aria2Download') }}</span>
			</v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-text-field
							:label="$t('aria2RPCDownloadPath')"
							v-model="downloadPath"
						></v-text-field>
					</v-row>
					<v-row>
						<v-checkbox
							:label="$t('aria2DownloadRecursive')"
							v-model="recursive"
							:disabled="!canOperate"
						></v-checkbox>
					</v-row>
				</v-container>
				<template v-if="status === 1">
					<v-alert dense type="info">
						{{
							$t('aria2FetchingFiles', {
								remainingFolderCount: fetchRemainingFolderCount
							})
						}}
					</v-alert>
				</template>
				<template v-if="status === 2">
					<v-alert dense type="info">
						{{
							$t('aria2DownloadStats', {
								fileCount: files.length,
								folderCount: folders.length,
								totalDownloadSize
							})
						}}
					</v-alert>
				</template>
				<template v-if="status === 3">
					<v-alert dense type="info">
						{{
							$t('aria2DownloadProgress', {
								remainingFileCount
							})
						}}
					</v-alert>
				</template>
				<template v-if="status === 4">
					<v-alert dense type="success">
						{{ $t('aria2DownloadSuccess') }}
					</v-alert>
				</template>
				<template v-if="status === 5">
					<v-alert dense type="error">
						{{ $t('aria2DownloadFailed', { failReason }) }}
					</v-alert>
				</template>
				<template v-if="status === 6">
					<v-alert dense type="error">
						{{ $t('aria2FetchFileFailed', { failReason }) }}
					</v-alert>
				</template>
			</v-card-text>
			<v-card-actions id="actions">
				<v-btn
					color="primary"
					@click="startDownload"
					v-text="$t('start')"
					:disabled="!canOperate"
					text
				></v-btn>
				<v-btn @click="close" v-text="$t('close')" text></v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import nodeUrl from 'url'
import nodePath from 'path'
import prettyBytes from 'pretty-bytes'
import aria2 from '../aria2'
import api from '../api'

export default {
	props: {
		path: String,
		rootId: String
	},
	data() {
		return {
			show: false,
			enabled: window.props.download_aria2,
			downloadPath: '',
			recursive: true,
			canOperate: false,
			files: [],
			folders: [],
			totalDownloadSize: '',
			remainingFileCount: 0,
			fetchRemainingFolderCount: 0,
			status: 1,
			failReason: ''
		}
	},
	watch: {
		recursive: function() {
			this.fetchLinks()
		}
	},
	methods: {
		onShow: function() {
			this.downloadPath = aria2.getDownloadPath() + this.path
			this.show = true
			this.fetchLinks()
		},
		startDownload: async function() {
			this.status = 3
			this.canOperate = false

			const files = this.files
			const downloadFileInfos = files.map(f => {
				let path = f.path.replace(this.path, '')
				path = nodePath.dirname(path)
				if (path === '.') {
					path = ''
				}

				const downloadPath = this.downloadPath + path
				const info = {
					name: f.fileName,
					url: f.url,
					downloadPath
				}
				return info
			})

			this.remainingFileCount = downloadFileInfos.length
			while (downloadFileInfos.length) {
				const f = downloadFileInfos.pop()
				try {
					const addResult = await aria2.addDownload(
						f.url,
						f.downloadPath
					)
				} catch (e) {
					this.failReason = e
					this.status = 5
					return
				}
				this.remainingFileCount--
			}
			this.status = 4
			this.canOperate = true
		},
		close: function() {
			this.show = false
		},
		getFileUrl(path) {
			const { rootId } = this.$route.query
			let u = nodeUrl.resolve(
				window.props.api,
				path
					.split('/')
					.map(encodeURIComponent)
					.join('/')
			)
			if (rootId) {
				u += '?rootId=' + rootId
			}
			return u
		},
		fetchLinks: async function() {
			this.canOperate = false
			this.status = 1

			let totalDownloadSize = 0
			const files = []
			const folders = [this.path]
			const folderQueue = [this.path]
			while (folderQueue.length !== 0) {
				this.fetchRemainingFolderCount = folderQueue.length
				const currentPath = folderQueue.pop()

				let pathItems
				try {
					pathItems = await this.listItems(currentPath, this.rootId)
				} catch (e) {
					this.failReason = e
					this.status = 6
					return
				}

				// add files
				const pathFiles = pathItems.filter(f => !f.isFolder)
				files.splice(files.length, 0, ...pathFiles)

				if (!this.recursive) {
					// stop if we don't recursive or no more folders to dive
					break
				}

				// ..if dive
				// add folder paths
				const pathFolders = pathItems.filter(f => f.isFolder)
				const pathFolderPaths = pathFolders.map(f => f.path)
				// folders for stat
				folders.splice(folders.length, 0, ...pathFolderPaths)
				// paths for dive
				folderQueue.splice(folderQueue.length, 0, ...pathFolderPaths)
			}
			files.forEach(f => {
				totalDownloadSize += f.fileRawSize
			})
			this.totalDownloadSize = prettyBytes(totalDownloadSize)

			this.files = files
			this.folders = folders

			this.canOperate = true
			this.status = 2
		},
		listItems: async function(path, rootId) {
			let { files } = await api
				.post(path, {
					method: 'POST',
					qs: {
						rootId
					}
				})
				.json()
			files = files.map(f => {
				f.mimeType = f.mimeType.replace('; charset=utf-8', '')
				const isFolder =
					f.mimeType === 'application/vnd.google-apps.folder'
				let resourcePath =
					nodeUrl.resolve(path, f.name) + (isFolder ? '/' : '')
				resourcePath = decodeURIComponent(resourcePath)
				const url = this.getFileUrl(resourcePath)
				const o = {
					fileName: f.name,
					isFolder,
					mimeType: f.mimeType,
					fileSize: f.size ? prettyBytes(parseInt(f.size)) : '',
					fileRawSize: parseInt(f.size || '0'),
					path: resourcePath,
					url
				}
				return o
			})
			return files
		}
	}
}
</script>
<style>
#actions {
	justify-content: flex-end;
}

#btn-show {
	margin-right: 10px;
}
</style>
