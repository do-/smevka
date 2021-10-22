module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_ack:

    function () {
    
		return require ('fs').readFileSync ('./Static/ack.xml')
    
    },
        
}