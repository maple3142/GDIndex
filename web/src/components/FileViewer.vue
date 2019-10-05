<template>
	<v-container fluid>
		<v-row justify="center">
			<v-col md="8">
				<v-card-title>
					<v-text-field
						v-model="search"
						append-icon="search"
						:label="$t('search')"
						single-line
						hide-details
					></v-text-field>
				</v-card-title>
				<v-data-table
					:headers="headers"
					:items="list"
					:items-per-page="-1"
					:hide-default-footer="true"
					:search="search"
					loading="true"
				>
					<template v-slot:item="row">
						<router-link
							:to="{
								path: row.item.resourcePath,
								query: $route.query
							}"
							class="fake-tr"
						>
							<td class="text-start">
								{{ row.item.fileName }}
							</td>
							<td class="text-start">
								{{ row.item.modifiedTime }}
							</td>
							<td class="text-start">
								{{ row.item.fileSize }}
							</td>
						</router-link>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import { format } from 'date-fns'
import prettyBytes from 'pretty-bytes'
import nodeUrl from 'url'
import api from '../api'

export default {
	data() {
		return {
			search: '',
			list: [],
			headers: [
				{
					text: this.$t('fileName'),
					value: 'fileName',
					class: ['fileName']
				},
				{
					text: this.$t('modifiedTime'),
					value: 'modifiedTime',
					filterable: false
				},
				{
					text: this.$t('fileSize'),
					value: 'fileSize',
					filterable: false
				}
			]
		}
	},
	computed: {
		path() {
			return '/' + this.$route.params.path
		}
	},
	methods: {
		async renderPath(path, rootId) {
			if (!rootId) {
				rootId = window.props.defaultRootId
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
			this.list = files.map(f => {
				const isFolder =
					f.mimeType === 'application/vnd.google-apps.folder'
				return {
					fileName: f.name,
					modifiedTime: format(
						new Date(f.modifiedTime),
						'yyyy/MM/dd HH:mm:ss'
					),
					mimeType: f.mimeType,
					fileSize: f.size ? prettyBytes(parseInt(f.size)) : '',
					resourcePath:
						nodeUrl.resolve(path, f.name) + (isFolder ? '/' : '')
				}
			})
			if (path !== '/') {
				this.list.unshift({
					fileName: '../',
					resourcePath: nodeUrl.resolve(path, '../')
				})
			}
		},
		handlePath(path, rootId) {
			if (path.substr(-1) === '/') {
				this.renderPath(path, rootId)
				return true
			} else {
				let u = nodeUrl.resolve(window.props.api, path)
				if (rootId && rootId !== window.props.defaultRootId) {
					u += '?rootId=' + rootId
				}
				location.href = u
			}
		}
	},
	created() {
		this.handlePath(this.path, this.$route.query.rootId)
	},
	beforeRouteUpdate(to, from, next) {
		if (this.handlePath('/' + to.params.path, to.query.rootId)) {
			next()
		}
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
</style>
