const {Transform} = require ('stream')
const path = require ('path')
const fs   = require ('fs')

module.exports = class {

	get_method_name () {
		let rq = this.rq
		if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
		if (rq.action) return 'do_'  + rq.action + '_' + rq.type
		return (rq.id ? 'get_item_of_' : 'select_') + rq.type
	}

	async fork (tia, data, pools) {

		let {conf, user} = this

		if (!pools) pools = conf.pools

		let rq = {}

		if (data) for (let k in data) rq [k] = data [k]
		for (let k of ['type', 'id', 'action', 'part']) rq [k] = tia [k] || this.rq [k]
		if (tia.part) {
			rq.part = tia.part
			delete rq.action
		}

		let b = this.get_log_banner (), log_meta = {parent: this.log_event}

		return new Promise (function (resolve, reject) {

			let h = new (require ('./Async')) ({user, conf, rq, pools, log_meta}, resolve, reject)

			darn (b + ' -> ' + h.get_log_banner ())

			setImmediate (() => h.run ())

		})

	}

}