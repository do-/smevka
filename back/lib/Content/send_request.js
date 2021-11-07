const {XMLReader} = require ('saxophone-object-stream')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_send_request:

    async function () {

    	let {conv, last, body} = this

    	let {MessageID, MessagePrimaryContent} = (await XMLReader.get (body, {
    		localName : 'SenderProvidedRequestData'
    	}))

    	last.id   = MessageID
    	
    	let [[k, v]] = Object.entries (MessagePrimaryContent)

    	last.data = v

    	last.type = k

			.replace (/Re(quest|sponse)$/, '') // method, not message name

			.replace (/[A-Z]/g,                // CamelCase to under_scores
				(m, o) => (o ? '_' : '') + m.toLowerCase ()
			)

		return require ('fs').readFileSync ('./Static/send.xml')

    },

}