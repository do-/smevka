const {XMLParser, XMLNode} = require ('xml-toolkit')
const path = require ('path')
const fs   = require ('fs')
const stringEscape = require ('string-escape-map')

const dump = XMLNode.toObject ()
const parse = xml => new XMLParser ().process (xml)

const XML_BODY = new stringEscape ([
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['&', '&amp;'],
])

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

		if (data) for (const k in data) rq [k] = data [k]
		
		for (const k of ['type', 'id', 'action', 'part']) rq [k] = tia [k] || this.rq [k]
		
		if (tia.part) {
			rq.part = tia.part
			delete rq.action
		}

		const log_meta = {parent: this.log_event}, {body_document} = this

		return new Promise (function (resolve, reject) {

			let h = new (require ('./Async')) ({user, conf, rq, pools, log_meta}, resolve, reject)

			h.body_document = body_document

			setImmediate (() => h.run ())

		})

	}
	
	check_params () {
		
		if ('body' in this && !('body_document' in this)) {

			const {body} = this

			if (body.trim ().charAt (0) === '<') {

				this.body_document = dump (parse (this.body))
				
				let {rq} = this; if (!rq.type) {

					const {Body} = this.body_document; if (!Body) throw new Error ('SOAP Body not found')

					rq.action = 'reply_to'
						
					for (const k in Body) switch (k) {
						case 'SendRequestRequest': 
							rq.type = 'send_request'
							break
						case 'GetResponseRequest': 
							rq.type = 'get_response'
							break
						case 'AckRequest': 
							rq.type = 'ack'
							break
						default:
							throw new Error ('Unknown request type: ' + k)
					}
			
				}
				
			}

		}
	
	}

}