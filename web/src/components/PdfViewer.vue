<template>
	<v-container fluid fill-height class="pt-0 pb-0">
		<v-layout row wrap>
			<v-flex d-flex>
				<object :data="url" type="application/pdf">
					<embed :src="url" type="application/pdf" />
				</object>
			</v-flex>
		</v-layout>
	</v-container>
</template>
<script>
import api from '../api'

export default {
	data() {
		return {
			url: ''
		}
	},
	async mounted() {
		const url = atob(this.$route.query.urlBase64)
		if (!localStorage.token) {
			this.url = url
		} else {
			const blob = await api.get(url).blob()
			console.log(blob)
			this.url = URL.createObjectURL(blob)
		}
	}
}
</script>
<style scoped>
object {
	width: 100%;
	height: 100%;
}
</style>
