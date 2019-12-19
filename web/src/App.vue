<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<portal-target name="left" slim />
			<v-toolbar-title class="headline pointer mr-3">
				Baby-club
			</v-toolbar-title>
			<portal-target name="navbar" slim />
		</v-app-bar>
		<v-content><FileViewer /></v-content>
		<LoginDialog :cond="showAuthInput" />
	</v-app>
</template>
<script>
import api from './api'
import LoginDialog from './components/LoginDialog.vue'
import FileViewer from './components/FileViewer.vue'


export default {
	props: {
		title: String
	},
	data() {
		return {
			showAuthInput: false
		}
	},

	components: { LoginDialog, FileViewer }
}
</script>
