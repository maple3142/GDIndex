<template>
	<v-container fluid>
		<portal to="navbar">
			<v-toolbar-items>
				<template v-for="seg in pathSegments">
					<v-icon :key="seg.path + '-icon'">mdi-menu-right</v-icon>
					<v-btn
						text
						class="text-none"
						:key="seg.path + '-btn'"
						@click="goPath(seg.path)"
						>{{ seg.name }}</v-btn
					>
				</template>
			</v-toolbar-items>
		</portal>
		<FileUploadDialog
			v-model="showUploadDialog"
			:uploadUrl="uploadUrl"
			@uploaded="uploadComplete"
		/>
		<v-row justify="center" v-if="uploadEnabled">
			<v-col md="8" lg="6" class="pt-0 pb-0">
				<v-btn
					v-text="$t('upload')"
					color="primary"
					@click="showUploadDialog = true"
				></v-btn>
			</v-col>
		</v-row>
		<v-row justify="center">
			<v-col md="8" lg="6">
				<v-card
					class="mx-auto"
					min-height="400px"
					tile
					:loading="loading"
				>
					<v-list-item
						v-for="item in list"
						:key="item.id"
						@click.prevent="goPath(item.resourcePath, item.opener)"
						class="pl-0"
						tag="a"
						:href="getFileUrl(item.resourcePath)"
					>
						<v-list-item-avatar class="ma-0">
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-item-avatar>
						<v-list-item-content class="py-2">
							<v-list-item-title
								v-text="item.fileName"
							></v-list-item-title>
							<v-list-item-subtitle
								v-if="!item.isFolder"
								v-text="item.fileSize"
							></v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-action>
							<v-btn
								icon
								v-if="!item.isFolder && !item.isGoogleFile"
								tag="a"
								:href="getFileUrl(item.resourcePath)"
								download
								@click.stop
							>
								<v-icon color="black">
									mdi-file-download
								</v-icon>
							</v-btn>
						</v-list-item-action>
					</v-list-item>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import { format } from 'date-fns'
import prettyBytes from 'pretty-bytes'
import nodeUrl from 'url'
import nodePath from 'path'
import api from '../api'
import ImageViewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import FileUploadDialog from './FileUploadDialog'

const SUPPORTED_TYPES = {
	'application/epub+zip': 'epub',
	'video/mp4': 'video',
	'image/png': 'image',
	'image/jpeg': 'image',
	'image/gif': 'image',
	'image/bmp': 'image',
	'application/pdf': 'pdf'
}
const ICON_NAME = {
	'application/vnd.google-apps.folder': 'mdi-folder',
	'application/epub+zip': 'mdi-book',
	'application/vnd.android.package-archive': 'mdi-android',
	'video/mp4': 'mdi-video',
	'video/x-msvideo': 'mdi-video',
	'video/x-flv': 'mdi-video',
	'video/x-ms-wmv': 'mdi-video',
	'video/webm': 'mdi-video',
	'video/x-matroska': 'mdi-video',
	'application/zip': 'mdi-archive',
	'application/x-7z-compressed': 'mdi-archive',
	'application/x-rar-compressed': 'mdi-archive',
	'application/x-gzip': 'mdi-archive',
	'image/png': 'mdi-file-image',
	'image/jpeg': 'mdi-file-image',
	'image/gif': 'mdi-file-image',
	'image/bmp': 'mdi-file-image',
	'application/msword': 'mdi-file-word',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		'mdi-file-word',
	'application/vnd.ms-excel': 'mdi-file-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
		'mdi-file-excel',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation':
		'mdi-file-powerpoint',
	'application/vnd.ms-powerpoint': 'mdi-file-powerpoint',
	'application/pdf': 'mdi-file-pdf',
	'text/x-sql': 'mdi-database',
	'application/vnd.google-apps.document': 'mdi-file-document-box',
	'application/vnd.google-apps.spreadsheet': 'mdi-google-spreadsheet',
	'application/vnd.google-apps.presentation': 'mdi-file-presentation-box',
	'text/plain': 'mdi-file-document'
}
export default {
	data() {
		return {
			list: [],
			loading: false,
			headers: [
				{
					text: this.$t('fileName'),
					value: 'fileName',
					class: ['fileName']
				},
				{
					text: this.$t('modifiedTime'),
					value: 'modifiedTime',
					filterable: false,
					class: 'hidden-sm-and-down'
				},
				{
					text: this.$t('fileSize'),
					value: 'fileSize',
					filterable: false,
					class: 'hidden-sm-and-down'
				}
			],
			renderStart: null,
			uploadEnabled: window.props.upload,
			showUploadDialog: false
		}
	},
	computed: {
		path() {
			return '/' + this.$route.params.path
		},
		pathSegments() {
			const list = this.path
				.split('/')
				.filter(Boolean)
				.map(decodeURIComponent)
			const ar = []
			for (let i = 0; i < list.length; i++) {
				ar.push({
					name: list[i],
					path: '/' + nodePath.join(...list.slice(0, i + 1)) + '/'
				})
			}
			return ar
		},
		uploadUrl() {
			const u = new URL(this.path, window.props.api)
			u.searchParams.set(
				'rootId',
				this.$route.query.rootId || window.props.default_root_id
			)
			return u.href
		}
	},
	methods: {
		goPath(path, opener) {
			const query = {
				rootId: this.$route.query.rootId
			}
			if (opener) {
				query.opener = opener
			}
			this.$router.push({
				path: path
					.split('/')
					.map(decodeURIComponent)
					.map(encodeURIComponent)
					.join('/'),
				query
			})
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
		async renderPath(path, rootId) {
			let renderStart = (this.renderStart = Date.now()) // Withous this, when user regret navigating a big folder, it will have some conflict.
			this.loading = true
			if (!rootId) {
				rootId = window.props.default_root_id
			}
			this.list = []
			const { files } = await api
				.post(path, {
					method: 'POST',
					qs: {
						rootId
					}
				})
				.json()
			if (renderStart !== this.renderStart) {
				// User had initiated other folder navigation request
				return
			}
			this.list = files.map(f => {
				f.mimeType = f.mimeType.replace('; charset=utf-8', '')
				const isFolder =
					f.mimeType === 'application/vnd.google-apps.folder'
				const isGoogleFile = f.mimeType.includes('vnd.google-apps')
				const resourcePath =
					nodeUrl.resolve(path, f.name) + (isFolder ? '/' : '')
				const o = {
					fileName: f.name,
					modifiedTime: format(
						new Date(f.modifiedTime),
						'yyyy/MM/dd HH:mm:ss'
					),
					isFolder,
					isGoogleFile,
					mimeType: f.mimeType,
					fileSize: f.size ? prettyBytes(parseInt(f.size)) : '',
					resourcePath,
					icon: ICON_NAME[f.mimeType] || 'mdi-file'
				}
				if (f.mimeType in SUPPORTED_TYPES) {
					o.opener = SUPPORTED_TYPES[f.mimeType]
				}
				return o
			})
			this.loading = false
		},
		handlePath(path, query) {
			if (path.substr(-1) === '/') {
				this.renderPath(path, query.rootId)
				return true
			} else {
				let u = nodeUrl.resolve(window.props.api, path)
				//if (Math.random() < 10) return
				if (
					query.rootId &&
					query.rootId !== window.props.default_root_id
				) {
					u += '?rootId=' + query.rootId
				}
				if (query.opener) {
					if (query.opener === 'image') {
						const img = new Image()
						img.src = u
						img.style.display = 'none'
						document.body.appendChild(img)
						img.onload = () => {
							const viewer = new ImageViewer(img)
							viewer.show()
							img.addEventListener('hide', () => {
								viewer.destroy()
								img.remove()
							})
						}

						return
					}
					this.$router.push({
						path: '/~viewer/' + query.opener,
						query: { urlBase64: btoa(u) }
					})
				} else {
					location.href = u
				}
			}
		},
		uploadComplete() {
			this.showUploadDialog = false
			this.renderPath(this.path, this.$route.query.rootId)
		}
	},
	created() {
		this.handlePath(this.path, this.$route.query)
	},
	beforeRouteUpdate(to, from, next) {
		const fullyEncoded = to.params.path
			.split('/')
			.map(decodeURIComponent)
			.map(encodeURIComponent)
			.join('/') // because vue-router's encoding is a little bit weird...
		if (this.handlePath('/' + fullyEncoded, to.query)) {
			next()
		}
	},
	components: {
		FileUploadDialog
	}
}
</script>
<style scoped>
.fake-tr {
	display: table-row;
	vertical-align: inherit;
	border-color: inherit;
	color: inherit;
	text-decoration: none;
}
.theme--light.v-data-table
	tbody
	.fake-tr:hover:not(.v-data-table__expanded__content) {
	background: #eeeeee;
}
.theme--light.v-data-table
	tbody
	.fake-tr:not(:last-child)
	td:not(.v-data-table__mobile-row) {
	border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.line-height {
	height: 48px;
	line-height: 48px;
}
.wrapper {
	display: flex;
	align-items: center;
}
.icon-wrapper {
	box-sizing: border-box;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
