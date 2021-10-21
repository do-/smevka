const back  = require ('./Content/Handler/WebUiBackend.js')
const mock  = require ('./Content/Handler/MockBackend.js')
const front = require ('./Ext/Dia/Content/Handler/HTTP/EluStatic.js')

module.exports = class extends require ('./Ext/Dia/Content/Handler/HTTP/Router.js') {

	create_http_handler (http) {
	
		let {conf} = this, {pools} = conf, {method, url} = http.request

		if (/\/_mock/.test (url)) return new mock ({conf, pools, http})

		if (method == 'POST' || url.match (/^\/(\?|_back)/)) return new back ({conf, pools: this.conf.pools, http})

		return new front ({conf, http})

	}
		
}