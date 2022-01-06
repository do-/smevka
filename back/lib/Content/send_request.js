module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_register_send_request:

    async function () {

    	let {last, body} = this

    	last.id = ZERO_UUID
    	
    	let [[k, v]] = Object.entries (JSON.parse (body))

    	last.data = v

    	last.type = k

			.replace (/Re(quest|sponse)$/, '') // method, not message name

			.replace (/[A-Z]/g,                // CamelCase to under_scores
				(m, o) => (o ? '_' : '') + m.toLowerCase ()
			)

		return {}

    },


////////////////////////////////////////////////////////////////////////////////

do_reply_to_send_request:

    async function () {

    	let {last, body} = this

    	let {MessageID, MessagePrimaryContent} = await this.get_body_element ('SenderProvidedRequestData')
    	
    	this.body = JSON.stringify (MessagePrimaryContent)
    	
    	await this.call ('do_register_send_request')

    	last.id = MessageID

		return require ('fs').readFileSync ('./Static/send.xml')

    },

}