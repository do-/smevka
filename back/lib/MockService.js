const {XMLParser, XMLNode, SOAP11, SOAPFault} = require ('xml-toolkit')
const {WebService, HttpParamReader, HttpResultWriter} = require ('doix-http')
const dump = XMLNode.toObject ()
const parse = xml => new XMLParser ().process (xml)

const SMEV_RQ_TYPE = {
	'SendRequestRequest': 'send_request',
	'GetResponseRequest': 'get_response',
	'AckRequest'        : 'ack',
}

function croak (o) {				
	const [[k, v]] = Object.entries (o)
	let	x = new Error (v)				
	x.detail = {[k]: {}}			
	throw x				
}

module.exports = class extends WebService {

	constructor (app, o = {}) {

		const xs_smev = app.globals.get ('xs_smev')
	
	    super (app, {

			methods: ['POST'],
			
			globals: {
				croak,
			},

			reader: new HttpParamReader ({

				from: {		
					searchParams: false,			
					bodyString: (body, job) => {			
						job.body = body					
						job.body_document = dump (parse (body))
						return {
							type: SMEV_RQ_TYPE [Object.keys (job.body_document.Body)[0]],
							action: 'reply_to',
						}				
					}				
				}

			}),

			writer: new HttpResultWriter ({
				type: SOAP11.contentType,
				stringify: data => SOAP11.message (xs_smev.stringify (data))
			}),

			dumper: new HttpResultWriter ({
				code: 500,
				type: SOAP11.contentType,
				stringify: (x, job) => {darn (x);
					if ('detail' in x) x.detail = xs_smev.stringify (x.detail)
					return SOAP11.message (new SOAPFault (x))		
				}
			}),
			
			...o

	    })

	}

}