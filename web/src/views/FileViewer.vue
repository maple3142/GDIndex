<template>
	<v-content>
		<v-app-bar app color="primary" dark>
			<portal-target name="left" slim/>
			<v-toolbar-title class="headline pointer ml-3">Baby-club - база знаний</v-toolbar-title>
			<portal-target name="navbar" slim/>
			<div class="sign-panel">
				<span class="sign-panel__email">{{ currentEmail }}</span>
				<v-btn
					@click="handleClickSignOut"
				>
					Выйти
				</v-btn>
			</div>
		</v-app-bar>
		<v-container fluid>
			<portal to="left">
				<v-toolbar-items>
					<v-btn @click="toggleMenu">
						<v-icon color="white">mdi-menu-open </v-icon>
					</v-btn>
				</v-toolbar-items>
			</portal>
			<v-row  class="myright">
				<v-col v-show="showmenu" style="min-width:50%; max-width:100%; max-height: calc(100vh - 100px);overflow: scroll;">
					<v-card
						class="mx-auto"
						tile
					>
						<v-sheet class="pa-4 primary lighten-2">
							<v-text-field
								v-model="search"
								label="Поиск"
								dark
								flat
								solo-inverted
								hide-details
								clearable
								clear-icon="mdi-close-circle-outline"
							></v-text-field>
						</v-sheet>
						<v-card-text>
							<v-treeview
								v-model="tree"
								:items="items"
								activatable
								:search="searchfilter"
								item-key="name"
								open-on-click
								:openAll="openAll"
							>
								<template v-slot:prepend="{ item }">
									<v-icon v-if="item.file === 'mdi-folder'">mdi-folder</v-icon>
									<v-icon v-else>{{ item.file }}</v-icon>
								</template>
								<template v-slot:label="{ item }">
									<a @click="goPath(item)" v-if="item.file !== 'mdi-folder'">{{ item.name }}</a>
									<div v-else>{{item.name}}</div>
								</template>
							</v-treeview>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col style="min-width:50%; max-width:100%;max-height: calc(100vh - 100px);overflow: scroll;">
					<iframe :src="link" width="100%" style="height: 100vh;"></iframe>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import { format } from 'date-fns'
import prettyBytes from 'pretty-bytes'
import nodeUrl from 'url'
import nodePath from 'path'
import api from '../api'
import ImageViewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

export default {
	name: "FileViewer",
	data() {
		return {
			currentEmail: '',
			showmenu: true,
			link: '',
			tree: [],
			items: [],
			search: null,
			loading: false,
			openAll: false,
			windowWidth: window.innerWidth,
			icons: {
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
				'text/plain': 'mdi-file-document',
				'application/vnd.google-apps.folder': 'mdi-folder'
			}
		}
	},
	computed: {
		searchfilter() {
			if (this.search && this.search.length > 3) {
				return this.search
			} else {
				return ''
			}
		}
	},
	methods: {
		handleClickSignOut() {
			this.$gAuth
				.signOut()
				.then(() => {
					this.$router.push('/');
				})
		},
		toggleMenu() {
			this.showmenu = !this.showmenu
		},
		goPath(item) {
			if (item.file !== 'application/vnd.google-apps.folder') {
				
				this.link = 'https://docs.google.com/viewer?srcid=' + item.id + '&pid=explorer&efh=false&a=v&chrome=false&embedded=true';
				if (this.windowWidth <= 500) {
					this.toggleMenu();
				}
				return;
			}
		},
		checkAndChange(obj) { 
			if (this.icons[obj.file]) {
				obj.file = this.icons[obj.file]
			} else {
				obj.file = 'mdi-file-document'
			}
			if (obj.name === 'root') {
				obj.name = 'Baby-club'
			}

			return obj
		},
		recursion(obj) {
			let o = obj;
			o = this.checkAndChange(o); 
			if (o.children) {
				o.children.sort(function(a, b) {
					if (a.file == 'application/vnd.google-apps.folder') {
						if (b.file == 'application/vnd.google-apps.folder') {
							if (a.name < b.name) {
								return -1;
							} else {
								return 1;
							}
						} else {
							return -1
						}
					} else {
						// a is file
						if (b.file == 'application/vnd.google-apps.folder') {
							// b is folder
							return 1;
						} else {
							// both files
							if (a.name < b.name) {
								return -1;
							} else {
								return 1;
							}
						}
					}
				})
				o.children.forEach(v => {
					this.recursion(v);
				});
			} else if (Array.isArray(o)) {
				o.sort(function(a, b) {
					if (a.file == 'application/vnd.google-apps.folder') {
						if (b.file == 'application/vnd.google-apps.folder') {
							if (a.name < b.name) {
								return -1;
							} else {
								return 1;
							}
						} else {
							return -1
						}
					} else {
						// a is file
						if (b.file == 'application/vnd.google-apps.folder') {
							// b is folder
							return 1;
						} else {
							// both files
							if (a.name < b.name) {
								return -1;
							} else {
								return 1;
							}
						}
					}
				})
				o.forEach(v => {
					this.recursion(v);
				});
			}
			return o; // return final new object
		}
	},
	created() {
		this.loading = true
		api.get('https://baby.fintech.workers.dev/baby.json')
		.json().then((data) => {
			this.items = this.recursion(data)
		})
		this.loading = false
	},
	mounted() {
		window.onresize = () => {
			this.windowWidth = window.innerWidth
		}

		let that = this;
		let checkGauthLoad = setInterval(function() {
			if (that.$gAuth.isInit) {
				!that.$gAuth.isAuthorized ? that.$router.push('/') : that.currentEmail = that.$gAuth.GoogleAuth.currentUser.Ab.w3.U3;
				clearInterval(checkGauthLoad);
			}
		}, 1);
	}
}
</script>
<style scoped>
.sign-panel {
	position: absolute;
	right: 10px;
}
.sign-panel__email {
	margin-right: 10px;
}
.headline {
	margin-right: 84px;
}
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
@media (max-width: 768px) {
	.sign-panel__email {
		display: none;
	}
}
@media (max-width: 500px) {
	.myright{
		flex-direction:column;
	}
	.myright>*{
		flex-basis: auto;
	}
}
</style>
