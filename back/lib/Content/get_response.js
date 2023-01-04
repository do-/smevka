const {XMLSchemata, SOAP11} = require ('xml-toolkit')

const DUMMY = {
	MessageType: 'RESPONSE',
	Sender: {
		Mnemonic: '',
		HumanReadableName: '',
	},
	DestinationName: '',
	SupplementaryData: {
		InteractionType: 'NotDetected',
	}
}

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_process_get_response:

    async function () {
    
    	const data = await this.fork ({action: 'reply_to'})

    	return SOAP11.message (this.xs_smev.stringify (data))
    
    },

////////////////////////////////////////////////////////////////////////////////

do_reply_to_get_response:

    async function () {

    	const {conf, rq, last} = this
    	
    	let GetResponseResponse = {}
    	
    	if (last.size === 0 || (this.body && Math.random () <= conf.responses.empty_rate)) return {GetResponseResponse}

		let {id} = rq; if (!id) id = last.keys ().next ().value

		const {type, data, uuid} = last.get (id)

		let [xsd_path, body] = await Promise.all ([
			this.fork ({type, part: 'xsd_path'}),
			this.fork ({type, part: 'response'}, {data}),
		])
		
		const xs = new XMLSchemata (xsd_path)	
		
		let FSAttachmentsList = {FSAttachment: null}; if ('_FSAttachmentsList' in body) {

			const {ftp} = conf
			
			FSAttachmentsList.FSAttachment = body._FSAttachmentsList.map (i => ({...i, ...ftp}))

			delete body._FSAttachmentsList

		}
		
		const MessagePrimaryContent = XMLSchemata.any (xs.stringify (body))		

		GetResponseResponse.ResponseMessage = {
		
			Response: {
			
				OriginalMessageId: id,

				SenderProvidedResponseData: {
					MessagePrimaryContent,
					MessageID: uuid,
					To: id,
				},
				
				MessageMetadata: {
					MessageId: uuid,
					SendingTimestamp: new Date (),
					...DUMMY
				},
				
				FSAttachmentsList,
				
			},

		}
		
		return {GetResponseResponse}

    },
        
}