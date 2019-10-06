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
import html from 'raw-loader!../assets/epub-reader.html'

export default {
	async mounted() {
		const url = atob(this.$route.query.urlBase64)
		const iframe = this.$refs.container
		iframe.srcdoc = html
		iframe.onload = () => {
			const win = iframe.contentWindow
			if (localStorage.token) {
				win.XMLHttpRequest.prototype._send =
					win.XMLHttpRequest.prototype.send
				win.XMLHttpRequest.prototype.send = function(...args) {
					this.setRequestHeader(
						'Authorization',
						'Basic ' + localStorage.token
					)
					return this._send(...args)
				}
			}
			win.reader = win.ePubReader(url)
			win.history.pushState = () => {}
			iframe.focus()
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
