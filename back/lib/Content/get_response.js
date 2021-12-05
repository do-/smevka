module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_get_response:

    async function () {

    	let {conf: {ftp: {login, password}}, conv, last: {type, id, data}} = this

		let [rsid, body] = await Promise.all ([
			this.fork ({type, part: 'rsid'}),
			this.fork ({type, part: 'response'}, {data}),
		])
		
		let xml = await conv.response ({path: `/${rsid}/jsonResponseToXml`}, JSON.stringify (body))

		return (xml
			.replace ('OriginalMessageId>00000000-0000-0000-0000-000000000000<', 'OriginalMessageId>' + id + '<')
			.replace ('MessageMetadata></', `MessageMetadata>
<FSAttachmentsList xmlns="urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1">
	<FSAttachment>
		<uuid>78cbaf77-4ebe-11ec-977f-005056b665bf</uuid>
		<UserName>${login}</UserName>
		<Password>${password}</Password>
		<FileName>/78cbaf77-4ebe-11ec-977f-005056b665bf.zip</FileName>
	</FSAttachment>
	<FSAttachment>
		<uuid>78d9e04a-4ebe-11ec-977f-005056b665bf</uuid>
		<UserName>${login}</UserName>
		<Password>${password}</Password>
		<FileName>/78d9e04a-4ebe-11ec-977f-005056b665bf.zip</FileName>
	</FSAttachment>
</FSAttachmentsList>
			</`)
		)

    },
        
}