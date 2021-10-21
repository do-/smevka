module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_send_request:

    async function () {
    
    	let {conv, last, body} = this
    	
		let [, message_id] = /MessageID>([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})</.exec (body) || []

		if (!message_id) throw new Exception ('MessageID not detected')

		last.message_id = message_id
		
		let [, tag] = /<((?:[0-9a-z]+:)?MessagePrimaryContent>)/.exec (body) || []
		
		if (!tag) throw new Error ('MessagePrimaryContent> not detected')
		
		let prim = body.split (tag) [1].replace (/<\/$/, '').trim ()

//darn (prim)
		
let rsid = 30442

		let json = await conv.response ({path: `/${rsid}/xmlRequestToJson`}, prim)
		
		last.data = JSON.parse (json)
darn (last)
		return (
`<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header/>
  <SOAP-ENV:Body>
    <ns4:SendRequestResponse xmlns:ns4="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1" xmlns:ns2="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1" xmlns:ns3="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/faults/1.1">
      <ns4:MessageMetadata Id="SIGNED_BY_SMEV">
        <ns4:MessageId>87b32127-323d-11ec-b0bc-000c293433a0</ns4:MessageId>
        <ns4:MessageType>REQUEST</ns4:MessageType>
        <ns4:Sender>
          <ns4:Mnemonic>780002</ns4:Mnemonic>
          <ns4:HumanReadableName>СМЭВ СПБ - Агрегатор</ns4:HumanReadableName>
        </ns4:Sender>
        <ns4:SendingTimestamp>2021-10-21T10:07:19.000+03:00</ns4:SendingTimestamp>
        <ns4:DestinationName>unknown</ns4:DestinationName>
        <ns4:Recipient>
          <ns4:Mnemonic>emu</ns4:Mnemonic>
          <ns4:HumanReadableName>emu</ns4:HumanReadableName>
        </ns4:Recipient>
        <ns4:SupplementaryData>
          <ns4:DetectedContentTypeName>not detected</ns4:DetectedContentTypeName>
          <ns4:InteractionType>NotDetected</ns4:InteractionType>
        </ns4:SupplementaryData>
        <ns4:Status>requestIsQueued</ns4:Status>
      </ns4:MessageMetadata>
      <ns4:SMEVSignature>
        <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1" xmlns:ns2="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1">
          <ds:SignedInfo>
            <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            <ds:SignatureMethod Algorithm="urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102012-gostr34112012-256"/>
            <ds:Reference URI="#SIGNED_BY_SMEV">
              <ds:Transforms>
                <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
                <ds:Transform Algorithm="urn://smev-gov-ru/xmldsig/transform"/>
              </ds:Transforms>
              <ds:DigestMethod Algorithm="urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34112012-256"/>
              <ds:DigestValue>9Gda25RUkr4c11/boVGE74A403lzgTvrFrJJNTjoDb0=</ds:DigestValue>
            </ds:Reference>
          </ds:SignedInfo>
          <ds:SignatureValue>ayH/Pc50dppWLiM8JZSMr0nzPpWGNcyjFnLf7FD8SMmabvOUwhu4kcreFCtni1bJ2mRfh9saVItEl+apArgL8Q==</ds:SignatureValue>
          <ds:KeyInfo>
            <ds:X509Data>
              <ds:X509Certificate>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</ds:X509Certificate>
            </ds:X509Data>
          </ds:KeyInfo>
        </ds:Signature>
      </ns4:SMEVSignature>
    </ns4:SendRequestResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`
		)

    },
        
}