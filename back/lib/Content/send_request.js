const EMU = {
	Mnemonic: 'emu',
	HumanReadableName: 'emu',
}

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_register_send_request:

    async function () {

    	let {uuid, last, data, body, rq: {id}} = this

    	let [[k, v]] = Object.entries (data || JSON.parse (body))

    	const type = k

			.replace (/Re(quest|sponse)$/, '') // method, not message name

			.replace (/[A-Z]/g,                // CamelCase to under_scores
				(m, o) => (o ? '_' : '') + m.toLowerCase ()
			)
			
		let r = {type, id, uuid}; r.data = await this.fork ({type, part: 'request'}, {data: v})
		
		last.set (id, r)

		return {}

    },

////////////////////////////////////////////////////////////////////////////////

do_reply_to_send_request:

    async function () {

    	const {conf, last} = this

    	if (last.size >= conf.requests.max) this.croak ({DestinationOverflow: `SMEV-600:Очередь, в которую должно быть отправлено сообщение, переполнена.`})

    	const {MessageID, MessagePrimaryContent} = this.body_document.Body.SendRequestRequest.SenderProvidedRequestData

//    	if (!is_uuid (MessageID)) this.croak ({InvalidMessageIdFormat: `SMEV-300:Недопустимый формат идентификатора сообщения. См. RFC-4122.`})

    	if (last.has (MessageID)) this.croak ({MessageIsAlreadySent: `SMEV-301:Сообщение с идентификатором ${MessageID} было послано ранее.`})

    	this.rq.id = MessageID

    	this.data = MessagePrimaryContent
    	
	    await this.call ('do_register_send_request')

		return {
			SendRequestResponse: {
				MessageMetadata: {
					MessageType: 'REQUEST',
					Sender: EMU,
					DestinationName: 'unknown',
					Recipient: EMU,
					SupplementaryData: {
						DetectedContentTypeName: 'not detected',
						InteractionType: 'NotDetected',
					},
					Status: 'requestIsQueued',
					MessageId: MessageID,
					SendingTimestamp: (new Date ()).toJSON (),
				},
			},
		}

    },

}