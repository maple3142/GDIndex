<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<v-toolbar-title class="headline pointer">
				<router-link
					:to="{ path: '/', query: $route.query }"
					tag="span"
					>{{ title }}</router-link
				>
			</v-toolbar-title>
			<v-spacer />

			<v-toolbar-items>
				<v-menu offset-y v-if="drives.length">
					<template v-slot:activator="{ on }">
						<v-btn text v-on="on" class="text-none">
							{{ currentDrive.text
							}}<v-icon>arrow_drop_down</v-icon>
						</v-btn>
					</template>
					<v-list>
						<v-list-item
							v-for="(item, index) in drives"
							:key="index.id"
							@click="changeDrive(item.value)"
						>
							<v-list-item-title>{{
								item.text
							}}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-toolbar-items>
		</v-app-bar>

		<v-content> <router-view /> </v-content>
	</v-app>
</template>
<script>
import api from './api'

export default {
	props: {
		title: String
	},
	data() {
		return {
			drives: [],
			value: {}
		}
	},
	computed: {
		currentDrive() {
			const id = this.$route.query.rootId || window.props.defaultRootId
			return this.drives.find(d => d.value === id)
		}
	},
	async created() {
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
			if (drive === this.currentDrive.id) return
			if (drive !== window.props.defaultRootId) {
				this.$router.push({ path: '/', query: { rootId: drive } })
			} else {
				this.$router.push({ path: '/', query: { rootId: undefined } })
			}
		}
	}
}
</script>
