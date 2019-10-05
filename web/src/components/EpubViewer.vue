<template>
	<iframe ref="container"></iframe>
</template>
<script>
import html from 'raw-loader!../assets/epub-reader.html'
import nodeUrl from 'url'

export default {
	mounted() {
		const url = nodeUrl.resolve(window.props.api, this.$route.query.path)
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
