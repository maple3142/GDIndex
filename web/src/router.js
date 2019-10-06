import Vue from 'vue'
import VueRouter from 'vue-router'
import FileViewer from './components/FileViewer.vue'
import EpubViewer from './components/EpubViewer.vue'
import VideoViewer from './components/VideoViewer.vue'
import PdfViewer from './components/PdfViewer.vue'

Vue.use(VueRouter)
const router = new VueRouter({
	routes: [
		{ path: '/~viewer/epub', component: EpubViewer },
		{ path: '/~viewer/video', component: VideoViewer },
		{ path: '/~viewer/pdf', component: PdfViewer },
		{ path: '/:path(.*)', component: FileViewer }
	],
	mode: 'history'
})

export default router
