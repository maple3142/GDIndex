<template>
	<v-app>
		<Auth></Auth>
		<FileViewer></FileViewer>
	</v-app>
</template>
<script>
import FileViewer from './components/FileViewer.vue'
import Auth from './components/Auth.vue'

export default {
	components: { 
		FileViewer,
		Auth 
	}
}
</script>
