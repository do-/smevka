const Async = require ('../../Ext/Dia/Content/Handler/Async.js')

module.exports = class extends Async.Handler {

	constructor (o, resolve, reject) {
		super (o, resolve, reject)
		this.import ((require ('./Base')), [
			'get_method_name',
			'fork', 
			'to_soap_fault',
		])
	}

}