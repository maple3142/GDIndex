<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<v-toolbar-title class="headline pointer mr-3 hidden-sm-and-down">
				<router-link
					:to="{ path: '/', query: { rootId: $route.query.rootId } }"
					tag="span"
					>Baby-club</router-link>
			</v-toolbar-title>
			<portal-target name="navbar" slim />
		</v-app-bar>
		<v-content> <router-view /> </v-content>
		<LoginDialog :cond="showAuthInput" />
	</v-app>
</template>
<script>
import api from './api'
import LoginDialog from './components/LoginDialog.vue'

export default {
	props: {
		title: String
	},
	data() {
		return {
			drives: [],
			value: {},
			showAuthInput: false
		}
	},
	computed: {
		currentDrive() {
			const id = this.$route.query.rootId || window.props.default_root_id
			return this.drives.find(d => d.value === id)
		}
	},
	async created() {
		const ok =
			new URL(window.props.api).hostname === location.hostname ||
			(await api
				.get(window.props.api)
				.then(() => true)
				.catch(err => {
					if (err.response.status === 401) {
						this.showAuthInput = true
						return false
					}
				}))
		if (!ok) return

		const { drives } = await api.get('/~_~_gdindex/drives').json()
		this.drives = [{ text: this.$t('mainDrive'), value: 'root' }].concat(
			drives.map(d => ({
				value: d.id,
				text: d.name
			}))
		)
	},
	methods: {
		changeDrive(drive) {
			const rootId =
				drive !== window.props.default_root_id ? drive : undefined
			const dest = { path: '/', query: { rootId } }
			if (
				dest.path === this.$route.path &&
				dest.query.rootId === this.$route.query.rootId
			) {
				return // vue-router forbid going to same location
			}
			this.$router.push({ path: '/', query: { rootId } })
		}
	},
	components: { LoginDialog }
}
</script>
