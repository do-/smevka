const RESPONSE = {AckResponse: null}

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_ack:

    async function () {
    
    	const {last, body_document, rq, xs_smev, xs_soap} = this

    	if (body_document) {
    	
    		rq.id = null

    		const uuid = body_document.Body.AckRequest.AckTargetMessage; if (uuid) {

    			for (const [k, v] of last.entries ()) if (v.uuid == uuid) {
    			
    				rq.id = k

    				break
    				
    			}
    			
    			if (!rq.id) this.croak ({TargetMessageIsNotFound: `SMEV-501: Сообщение ${uuid} не найдено среди неподтверждённых`})
    			
    		}

    	}

    	if (rq.id) last.delete (rq.id)

    	return RESPONSE

    },

}