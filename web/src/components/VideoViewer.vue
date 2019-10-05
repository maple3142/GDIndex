<template>
	<v-container fluid>
		<v-row justify="center">
			<v-col md="8">
				<video controls ref="video">
					<source ref="source" />
					<track
						ref="track"
						label="Unknown"
						kind="subtitles"
						srclang="en"
						default
					/>
				</video>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import api from '../api'

const MIME = {
	mp4: 'video/mp4'
}
function checkExists(url) {
	const ct = new AbortController()
	return api
		.get(url, {
			signal: ct.signal
		})
		.then(r => {
			ct.abort()
			return r.status === 200
		})
		.catch(() => false)
}
const srt2vtt = s =>
	'WEBVTT FILE\r\n\r\n' +
	s
		.replace(/\{\\([ibu])\}/g, '</$1>')
		.replace(/\{\\([ibu])1\}/g, '<$1>')
		.replace(/\{([ibu])\}/g, '<$1>')
		.replace(/\{\/([ibu])\}/g, '</$1>')
		.replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
		.concat('\r\n\r\n')
export default {
	async mounted() {
		const { video, source, track } = this.$refs
		const url = new URL(atob(this.$route.query.urlBase64))
		const toks = url.pathname.split('.')
		const pathSansExt = toks.slice(0, -1).join('.')
		const ext = toks.slice(-1)[0].toLowerCase()
		source.type = MIME[ext]
		source.src = url.href

		const srtUrl = new URL(url)
		srtUrl.pathname = pathSansExt + '.srt'
		const hasSrt = await checkExists(srtUrl)
		if (hasSrt) {
			const srt = await api.get(srtUrl).text()
			const blob = new Blob([srt2vtt(srt)], { type: 'text/vtt' })
			track.src = URL.createObjectURL(blob)
			video.textTracks[0].mode = 'show'
		}

		video.play()
	},
	beforeDestroy() {
		const { video } = this.$refs
		video && video.stop && video.stop()
	}
}
</script>
<style scoped>
video {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
