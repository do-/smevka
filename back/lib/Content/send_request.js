module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_send_request:

    async function () {
    
    	let {conv, last, body} = this
    	
		let [, message_id] = /MessageID>([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})</.exec (body) || []

		if (!message_id) throw new Exception ('MessageID not detected')

		last.id = message_id	

		let {prim, type} = await this.fork ({type: 'soap_message', action: 'parse'}, {xml: body})

		let rsid = await this.fork ({type, part: 'rsid'})

		last.type = type

		let json = await conv.response ({path: `/${rsid}/xmlRequestToJson`}, prim)

		last.data = Object.values (JSON.parse (json)) [0]

		return require ('fs').readFileSync ('./Static/send.xml')

    },
        
}