const localName = 'MessagePrimaryContent'	

const scan = o => {

	if (localName in o) return o [localName]

	for (const v of Object.values (o)) if (v != null && typeof v === 'object') {

		const y = scan (v)

		if (y != null) return y

	}

	return null

}

module.exports = {
		
////////////////////////////////////////////////////////////////////////////////

get_json_of_soap_message:

	async function () {
	
		const {body_document} = this

		return scan (body_document) || body_document

	}

}