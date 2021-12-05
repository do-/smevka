module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_reply_to_get_response:

    async function () {

    	let {conv, last: {type, id, data}} = this

		let [rsid, body] = await Promise.all ([
			this.fork ({type, part: 'rsid'}),
			this.fork ({type, part: 'response'}, {data}),
		])
		
		let FSAttachmentsList = ''; if ('_FSAttachmentsList' in body) {
		
			const {login, password} = this.conf.ftp
		
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
		
		}
		
		let xml = await conv.response ({path: `/${rsid}/jsonResponseToXml`}, JSON.stringify (body))

		xml = xml.replace ('OriginalMessageId>00000000-0000-0000-0000-000000000000<', 'OriginalMessageId>' + id + '<')

		if (FSAttachmentsList) xml = xml.replace ('MessageMetadata></', `MessageMetadata>${FSAttachmentsList}</`)

		return xml

    },
        
}