<template>
	<v-container fluid fill-height class="pt-0 pb-0">
		<v-layout row wrap>
			<v-flex d-flex>
				<iframe ref="container"></iframe>
			</v-flex>
		</v-layout>
	</v-container>
</template>
<script>
import html from 'raw-loader!../assets/pdfviewer.html'
import api from '../api'

export default {
	data() {
		return {
			url: ''
		}
	},
	async mounted() {
		const url = atob(this.$route.query.urlBase64)
		const iframe = this.$refs.container
		iframe.srcdoc = html
		iframe.onload = () => {
			const win = iframe.contentWindow
			api.get(url)
				.then(r => r.arrayBuffer())
				.then(ab => win.PDFViewerApplication.open(ab))
		}
	}
}
</script>
<style scoped>
iframe {
	width: 100%;
	height: 100%;
}
</style>
