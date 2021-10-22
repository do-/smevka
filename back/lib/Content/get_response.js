module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_get_response:

    async function () {

    	let {conv, last: {type, id, data}} = this

		let [rsid, body] = await Promise.all ([
			this.fork ({type, part: 'rsid'}),
			this.fork ({type, part: 'response'}, {data}),
		])
		
		let xml = await conv.response ({path: `/${rsid}/jsonResponseToXml`}, JSON.stringify (body))
		
		return xml.replace ('OriginalMessageId>00000000-0000-0000-0000-000000000000<', 'OriginalMessageId>' + id + '<')

    },
        
}