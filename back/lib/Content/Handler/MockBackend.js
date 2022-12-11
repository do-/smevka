const {SOAP11, SOAPFault} = require ('xml-toolkit')
const Dia = require ('../../Ext/Dia/Dia.js')
module.exports = class extends Dia.HTTP.Handler {
    
    constructor (o) {
		super (o)
		this.import ((require ('./Base')), [
			'check_params',
			'fork', 
			'to_soap_fault',
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

    parse_http_request_body () {
    
    	const map = {
    		SendRequest : 'send_request',
    		GetResponse : 'get_response',
    		Ack         : 'ack',
    	}

    	let {body} = this, [_, tag] = /<SOAP[\w\-]+:Body>\s*<(\w+)Request/.exec (body)

    	if (!tag) throw new Error ('Cannot detect Request element in ' + body)

    	let type = map [tag]; if (!type) throw new Error ('Unknown request type: ' + tag)
    	
    	this.rq = {type, action: 'reply_to'}

    }

    send_out_data (data) {
    
    	if (typeof data === 'object') {

	    	const {xs_smev, xs_soap} = this

			data = "<?xml version='1.0' encoding='utf-8'?>" + xs_soap.stringify ({
				Envelope: {
					Body: {
						null: {
							[xs_smev.stringify (data)]: {}
						}
					}
				}
			})

    	}
    
 		let rp = this.http.response
        rp.statusCode = 200
        rp.setHeader ('Content-Type', 'application/soap+xml')
        rp.end (data)

	}
	
	croak (o) {
	
    	const [[k, v]] = Object.entries (o)
	    	
	    let	x = new Error (v)
	    	
    	x.detail = {[k]: {}}

		throw x
	
	}

    send_out_error (x) {
        
    	if ('detail' in x) x.detail = this.xs_smev.stringify (x.detail)
    
 		let rp = this.http.response
        rp.statusCode = 500
        rp.setHeader ('Content-Type', 'application/soap+xml')
        
        rp.end (SOAP11.message (new SOAPFault (x)))

    }

    
}