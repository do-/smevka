module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_register_send_request:

    async function () {

    	let {uuid, last, data, body, rq: {id}} = this

    	let [[k, v]] = Object.entries (data || JSON.parse (body))

    	const type = k

			.replace (/Re(quest|sponse)$/, '') // method, not message name

			.replace (/[A-Z]/g,                // CamelCase to under_scores
				(m, o) => (o ? '_' : '') + m.toLowerCase ()
			)
			
		let r = {type, id, uuid}; r.data = await this.fork ({type, part: 'request'}, {data: v})
		
		last.set (id, r)

		return {}

    },

////////////////////////////////////////////////////////////////////////////////

do_reply_to_send_request:

    async function () {

    	const {MessageID, MessagePrimaryContent} = this.body_document.Body.SendRequestRequest.SenderProvidedRequestData

    	this.rq.id = MessageID

    	this.data = MessagePrimaryContent
    	
    	try {

	    	await this.call ('do_register_send_request')

    	}
    	catch (e) {

	    	return this.to_soap_fault (e)

    	}

		return require ('fs').readFileSync ('./Static/send.xml')

    },

}