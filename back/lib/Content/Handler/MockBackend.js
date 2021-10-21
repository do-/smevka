const Dia = require ('../../Ext/Dia/Dia.js')
module.exports = class extends Dia.HTTP.Handler {
    
    constructor (o) {
		super (o)
		this.import ((require ('./Base')), [
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
 		let rp = this.http.response
        rp.statusCode = 200
        rp.setHeader ('Content-Type', 'application/soap+xml')
        rp.end (data)
	}
    
}