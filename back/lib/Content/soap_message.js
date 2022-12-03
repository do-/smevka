module.exports = {
	
////////////////////////////////////////////////////////////////////////////////

get_json_of_soap_message:

	async function () {

		return this.get_body_element ('MessagePrimaryContent')

	}	

}