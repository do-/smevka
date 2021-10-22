const {Readable} = require ('stream')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_primary_content_of_soap_message:

    async function () {
    
    	let {rq: {xml}} = this

		let [, tag] = /<((?:[0-9a-z]+:)?MessagePrimaryContent>)/.exec (xml) || []
		
		if (!tag) throw new Error ('MessagePrimaryContent> not detected')
		
		return xml.split (tag) [1].replace (/<\/$/, '').trim ()
		
    },
    
////////////////////////////////////////////////////////////////////////////////

get_type_of_soap_message:

    async function () {
    
    	let {rq: {xml}} = this
		
		return /^<.*?>/.exec (xml) [0]    // MessagePrimaryContent's 1st inner tag
			.split (/\s/) [0]                  // before attibutes
			.slice (1)                         // without opening bracket
			.split (':').pop ()                // if prefixed, local name only
			.replace (/Re(quest|sponse)$/, '') // method, not message name
			.replace (/[A-Z]/g,                // CamelCase to under_scores
				(m, o, s) => (o ? '_' : '') + m.toLowerCase ()
			)

    },

////////////////////////////////////////////////////////////////////////////////

get_json_of_soap_message:

    async function () {
    
    	let {conv, rq: {xml}} = this
    	
		let prim = await this.fork ({part: 'primary_content'}, {xml})

		let type = await this.fork ({part: 'type'}, {xml: prim})

		let rsid = await this.fork ({type, part: 'rsid'})
		
		let path = 
			/GetResponseResponse/.test (xml) ? 'xmlResponseToJson' :
			/SendRequestRequest/.test (xml) ? 'xmlRequestToJson' :
			null
			
		if (!path) throw ('No SendRequestRequest nor GetResponseResponse detected')
		
		if (path == 'xmlRequestToJson') xml = prim
			
		let json = await conv.response ({path: `/${rsid}/${path}`}, xml)
 		
		return Readable.from (json)

    },
        
}