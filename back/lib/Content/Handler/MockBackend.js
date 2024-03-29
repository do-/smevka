const {SOAP11, SOAPFault} = require ('xml-toolkit')
const Dia = require ('../../Ext/Dia/Dia.js')
module.exports = class extends Dia.HTTP.Handler {
    
    constructor (o) {
		super (o)
		this.import ((require ('./Base')), [
			'check_params',
			'fork', 
		])
    }

    get_ttl () {
    	return 0
    }

	get_method_name () {
		let rq = this.rq
		if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
		if (rq.action) return 'do_'  + rq.action + '_' + rq.type
		return (rq.id ? 'get_item_of_' : 'select_') + rq.type
	}

    check () {
        super.check ()
        let m = this.http.request.method
        if (m != 'POST') throw '405 No ' + m + 's please'
    }

    is_anonymous () {
        return true
    }

    is_transactional () {
        return false
    }

	croak (o) {
	
    	const [[k, v]] = Object.entries (o)
	    	
	    let	x = new Error (v)
	    	
    	x.detail = {[k]: {}}

		throw x
	
	}

    send_out_error (x) {
        
    	if ('detail' in x) x.detail = this.xs_smev.stringify (x.detail)

    	this.send_out_soap_message (500, new SOAPFault (x))

    }

    send_out_data (data) {

    	this.send_out_soap_message (200, this.xs_smev.stringify (data))

	}

    send_out_soap_message (statusCode, body) {
    
//    	const encoding = 'UTF-8'
    
 		const {response} = this.http
 		
 		const xml = SOAP11.message (body)
// 		const xml = SOAP11.message (body, null, {declaration: {encoding}})
 		
// 		const content = Buffer.from (xml, encoding)

		response.writeHead (statusCode, {
			'Content-Type': SOAP11.contentType,
//			'Content-Type': SOAP11.contentType + '; charset=utf-8',
//			'Content-Length': content.length
		})

//        response.end (content)
        response.end (xml)

	}
    
}