import Vue from 'vue'
import VueRouter from 'vue-router'
import FileViewer from './components/FileViewer.vue'
import EpubViewer from './components/EpubViewer.vue'

Vue.use(VueRouter)
const router = new VueRouter({
	routes: [
		{ path: '/~epubviewer', component: EpubViewer },
		{ path: '/:path(.*)', component: FileViewer }
	],
	mode: 'history'
})

export default router
