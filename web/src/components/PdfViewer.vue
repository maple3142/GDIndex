<template>
	<v-container fluid fill-height class="pt-0 pb-0">
		<v-layout row wrap>
			<v-flex d-flex>
				<object :data="url" type="application/pdf" name="test.pdf">
					<embed :src="url" type="application/pdf" />
				</object>
			</v-flex>
		</v-layout>
	</v-container>
</template>
<script>
export default {
	computed: {
		url() {
			return atob(this.$route.query.urlBase64)
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
