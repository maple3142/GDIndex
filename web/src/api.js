import xf from 'xfetch-js'

export default xf.extend({
	baseURI: window.props.api || location.protocol + '://' + location.host
})
