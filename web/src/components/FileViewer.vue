<template>
	<v-container fluid>
		<portal to="left">
			<v-toolbar-items>
				<v-btn
					@click="toggleMenu"
				>
					<v-icon color="white">
						mdi-menu-open 
					</v-icon>
				</v-btn>
			</v-toolbar-items>
		</portal>
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
		<v-row>
			<v-col md="6" lg="4" sm="12" xs="12" v-show="showmenu" style="max-height: 100vh;overflow: scroll;">
				<v-card
					class="mx-auto"
					min-height="400px"
					tile
					:loading="Загрузка"
				>

					<v-treeview
				      v-model="tree"
				      :open="open"
				      :items="items"
				      activatable
				      item-key="name"
				      open-on-click
				    >
				      <template v-slot:prepend="{ item, open }">
				        <v-icon v-if="item.file == 'application/vnd.google-apps.folder'">
				          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
				        </v-icon>
				        <v-icon v-else @click="goPath(item)">
				          {{ ICON_NAME[item.file] }}
				        </v-icon>
				      </template>
				    </v-treeview>
				</v-card>
			</v-col>
			<v-col md="6" lg="8" sm="12" xs="12" style="max-height: 100vh;overflow: scroll;">
				<iframe :src="link" width="100%" style="height: 100vh;"></iframe>
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
			showmenu: true,
			link: '',
			tree: [],
			items: [],
			loading: false
		}
	},
	methods: {
		toggleMenu() {
			this.showmenu = !this.showmenu
		},
		goPath(item) {
			if (item.file !== 'application/vnd.google-apps.folder') {
				
				this.link = 'https://docs.google.com/viewer?srcid=' + id + '&pid=explorer&efh=false&a=v&chrome=false&embedded=true';
				return
			}
		},
		
	},
	created() {
		this.loading = true
		api.get('https://baby.fintech.workers.dev/baby.json')
		.json().then((data) => {
			this.items = data
		})
		this.loading = false
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
