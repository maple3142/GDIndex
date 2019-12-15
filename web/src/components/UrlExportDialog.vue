<template>
	<v-dialog v-model="show" max-width="700">
		<template v-slot:activator="{ on }">
			<v-btn
				v-if="enabled"
				v-text="$t('exportUrl')"
				color="primary"
				@click="onShow"
				id="btn-show"
			></v-btn>
		</template>
		<v-card>
			<v-card-title class="headline">
				<span>{{ $t('exportUrl') }}</span>
			</v-card-title>
			<v-card-text>
				<div id="preferences">
					<v-checkbox
						:label="$t('exportUrlIncludeSubFolders')"
						v-model="recursive"
						dense
						:disabled="!canOperate"
					></v-checkbox>
					<v-checkbox
						:label="$t('exportUrlIncludeFileName')"
						dense
						v-model="includeFileName"
						:disabled="!canOperate"
					></v-checkbox>
				</div>
				<template v-if="status === 1">
					<v-alert dense type="info">
						{{
							$t('exportUrlFetchingFiles', {
								remainingFolderCount: fetchRemainingFolderCount
							})
						}}
					</v-alert>
				</template>
				<template v-if="status === 3">
					<v-alert dense type="error">
						{{ $t('exportUrlFetchFileFailed', { failReason }) }}
					</v-alert>
				</template>
				<template v-if="status === 2">
					<v-textarea
						readonly
						solo
						auto-grow
						id="downloadUrls"
						:value="downloadUrls"
					/>
					<v-alert dense type="info">
						{{
							$t('exportUrlStats', {
								fileCount: files.length,
								folderCount: folders.length,
								totalDownloadSize
							})
						}}
					</v-alert>
				</template>
			</v-card-text>
			<v-card-actions id="actions">
				<v-btn @click="close" v-text="$t('close')" text></v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import nodeUrl from 'url'
import nodePath from 'path'
import prettyBytes from 'pretty-bytes'
import api from '../api'

export default {
	props: {
		path: String,
		rootId: String
	},
	data() {
		return {
			show: false,
			enabled: window.props.export_url,
			recursive: true,
			canOperate: false,
			files: [],
			folders: [],
			totalDownloadSize: '',
			remainingFileCount: 0,
			fetchRemainingFolderCount: 0,
			status: 1,
			failReason: '',
			includeFileName: true,
			downloadUrls: ''
		}
	},
	watch: {
		recursive: function() {
			this.fetchLinks()
		},
		includeFileName: function() {
			this.composeDownloadUrls()
		}
	},
	methods: {
		onShow: function() {
			this.show = true
			this.fetchLinks()
		},
		copyToClipboard: function() {},
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

			this.status = 2

			this.composeDownloadUrls()
		},
		composeDownloadUrls: function() {
			if (this.status !== 2) {
				return
			}

			this.canOperate = false
			const showFilenames = this.includeFileName
			const files = this.files

			const urls = []
			for (const f of files) {
				let url = decodeURIComponent(f.url)
				if (showFilenames) {
					url = f.fileName + '|' + url
				}
				urls.push(url)
			}

			this.downloadUrls = urls.join('\n')
			this.canOperate = true
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

#preferences {
	display: flex;
	flex-direction: row;
}

#preferences > * {
	display: inline-block;
	margin-right: 15px;
}

#downloadUrls {
	max-height: 300px;
	overflow-y: scroll;
}
</style>
