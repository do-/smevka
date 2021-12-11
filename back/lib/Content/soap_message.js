const {XMLReader, SAXEvent, XMLLexer, MoxyLikeJsonEncoder} = require ('xml-toolkit')

module.exports = {
	
////////////////////////////////////////////////////////////////////////////////

get_json_of_soap_message:

	async function () {
	
		const lex = new XMLLexer ({})

		const sax = new XMLReader ({
			stripSpace : true,
			collect    : e => true,
			find       : e => e.localName === 'MessagePrimaryContent' && e.type === SAXEvent.TYPES.END_ELEMENT,
			map        : MoxyLikeJsonEncoder ()
		})

		lex.pipe (sax)

		return new Promise ((ok, fail) => {
		
			lex.on ('error', fail)
			sax.on ('error', fail)
			
			const not_found = () => fail (new Error ('MessagePrimaryContent not found'))
			
			sax.on ('end', not_found)

			sax.on ('data', data => {
				sax.off ('end', not_found)
				ok (data)
			})
			
			lex.end (this.body)
		
		})
		
	}	

}