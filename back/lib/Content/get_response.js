const {XMLSchemata} = require ('xml-toolkit')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_get_response:

    async function () {
    
    	const {conf, rq, last} = this
    	
    	let {id} = rq; if (!id) id = last.keys ().next ()

//    	if (!id || !last.has (id) || (this.body && Math.random () <= conf.responses.empty_rate)) return require ('fs').readFileSync ('./Static/empty_response.xml')

		const {type, data} = last.get (id)

		try {

			[xsd_path, body] = await Promise.all ([
				this.fork ({type, part: 'xsd_path'}),
				this.fork ({type, part: 'response'}, {data}),
			])		

		}
		catch (e) {
		
	    	return this.to_soap_fault (e)
		
		}
		
		const xs = await XMLSchemata.fromFile (xsd_path)		

		let FSAttachmentsList = ''; if ('_FSAttachmentsList' in body) {
		
			const {login, password} = conf.ftp
		
			FSAttachmentsList = '<FSAttachmentsList xmlns="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1">'

			for (const i of body._FSAttachmentsList) FSAttachmentsList += `
				<FSAttachment>
					<uuid>${i.uuid}</uuid>
					<UserName>${login}</UserName>
					<Password>${password}</Password>
					<FileName>${i.FileName}</FileName>
				</FSAttachment>
			`

			FSAttachmentsList += '</FSAttachmentsList>'
		
			files = body.files; delete body.files
			
			delete body._FSAttachmentsList
		
		}
		
		return (
`<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header/>
  <SOAP-ENV:Body>
    <GetResponseResponse xmlns="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1" xmlns:ns0="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1">
      <ResponseMessage>
        <Response>
          <OriginalMessageId>${id}</OriginalMessageId>
          <SenderProvidedResponseData>
            <MessageID>${this.uuid}</MessageID>
            <To/>
            <ns0:MessagePrimaryContent>${xs.stringify (body)}</ns0:MessagePrimaryContent>
          </SenderProvidedResponseData>
          <MessageMetadata>
            <MessageId>${this.uuid}</MessageId>
            <MessageType>RESPONSE</MessageType>
            <Sender>
              <Mnemonic/>
              <HumanReadableName/>
            </Sender>
            <SendingTimestamp>${new Date ().toJSON ()}</SendingTimestamp>
            <DestinationName/>
            <SupplementaryData>
              <InteractionType>NotDetected</InteractionType>
            </SupplementaryData>
          </MessageMetadata>
          ${FSAttachmentsList}
        </Response>
      </ResponseMessage>
    </GetResponseResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`)            

    },
        
}