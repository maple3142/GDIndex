import xf from './xfetch'

const headers = {}
if (localStorage.token) {
	headers.Authorization = 'Basic ' + localStorage.token
}
export default xf.extend({
	baseURI: window.props.api,
	headers
})
