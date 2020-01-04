import xf from './xfetch'

const subdir = window.props.subdir

export function getSubDirPath(path) {
	if (
		typeof path === 'string' &&
		!path.startsWith(`${subdir}/`) &&
		!path.startsWith(`/${subdir}/`)
	) {
		if (path.startsWith('/')) {
			return `/${subdir}${path}`
		} else {
			return `/${subdir}/${path}`
		}
	}
	return path
}

const headers = {}

if (localStorage.token) {
	headers.Authorization = 'Basic ' + localStorage.token
}

export default xf.extend({
	baseURI: window.props.api,
	headers
})
