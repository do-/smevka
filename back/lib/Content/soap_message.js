const Saxophone = require ('saxophone')
const {XMLReader} = require ('saxophone-object-stream')

module.exports = {
	
////////////////////////////////////////////////////////////////////////////////

get_json_of_soap_message:

	async function () {

		return XMLReader.get (this.body, {localName : 'MessagePrimaryContent'})
			
	}	
	
}