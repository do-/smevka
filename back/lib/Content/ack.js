module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_ack:

    async function () {
    	
    	const {last, body, rq} = this
    	
    	if (body) {
    	
    		const uuid = await this.get_body_element ('AckTargetMessage')
    		
    		if (uuid) for (const [k, v] of last.entries ()) if (v.uuid == uuid) last.delete (k)
    	
    	}
    	else if (rq.id) {
    	
    		last.delete (rq.id)
    	
    	}
    	
darn (['ack', last])
    
		return require ('fs').readFileSync ('./Static/ack.xml')
    
    },
        
}