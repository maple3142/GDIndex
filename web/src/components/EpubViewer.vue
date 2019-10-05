<template>
	<v-container fluid fill-height>
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
	mounted() {
		const url = this.$route.query.url
		const iframe = this.$refs.container
		iframe.srcdoc = html
		iframe.onload = () => {
			iframe.contentWindow.reader = iframe.contentWindow.ePubReader(url)
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
