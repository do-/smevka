module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_register_send_request:

    async function () {

    	let {last, data} = this
    	
    	let [[k, v]] = Object.entries (data)

    	const type = last.type = k

			.replace (/Re(quest|sponse)$/, '') // method, not message name

			.replace (/[A-Z]/g,                // CamelCase to under_scores
				(m, o) => (o ? '_' : '') + m.toLowerCase ()
			)
			
		last.data = await this.fork ({type, part: 'request'}, {data: v})

		return {}

    },


////////////////////////////////////////////////////////////////////////////////

do_reply_to_send_request:

    async function () {

    	let {last, body} = this

    	let {MessageID, MessagePrimaryContent} = await this.get_body_element ('SenderProvidedRequestData')
    	
    	last.id = MessageID

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