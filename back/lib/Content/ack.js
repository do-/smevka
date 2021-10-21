module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_ack:

    function () {

		return (
`<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header/>
  <SOAP-ENV:Body>
	<ns4:AckResponse xmlns:ns4="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1" xmlns:ns2="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1" xmlns:ns3="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/faults/1.1"/>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`
		)

    },
        
}