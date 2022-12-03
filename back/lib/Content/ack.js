module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_ack:

    async function () {

    	const {last, body_document, rq} = this

    	if (body_document) {

    		const uuid = body_document.Body.AckRequest.AckTargetMessage

    		if (uuid) for (const [k, v] of last.entries ()) if (v.uuid == uuid) last.delete (k)

    	}
    	else if (rq.id) {

    		last.delete (rq.id)

    	}

		return require ('fs').readFileSync ('./Static/ack.xml')

    },
        
}