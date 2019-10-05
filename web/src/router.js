import Vue from 'vue'
import VueRouter from 'vue-router'
import FileViewer from './components/FileViewer.vue'

Vue.use(VueRouter)
const router = new VueRouter({
	routes: [{ path: '/:path(.*)', component: FileViewer }],
	mode: 'history'
})

export default router
