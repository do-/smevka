////////////////////////////////////////////////////////////////////////////////

function get_frame (name) {

	return window.parent.frames [name].document

}

////////////////////////////////////////////////////////////////////////////////

function get_textarea () {

	return get_frame ('left').querySelectorAll ('textarea') [0]

}

////////////////////////////////////////////////////////////////////////////////

function get_button (frame, name) {

	return get_frame (frame).querySelectorAll ('button[name=' + name + ']') [0]

}

////////////////////////////////////////////////////////////////////////////////

function get_file_input () {

	return get_frame ('left').querySelectorAll ('input[type=file]') [0]

}

////////////////////////////////////////////////////////////////////////////////

function get_pre () {

	return get_frame ('right').querySelector ('pre')

}

////////////////////////////////////////////////////////////////////////////////

function say (s) {

	return get_pre ().textContent = s;

}

////////////////////////////////////////////////////////////////////////////////

function prettifyXml (sourceXml) // src: https://stackoverflow.com/questions/376373/pretty-printing-xml-with-javascript/
{
    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString([
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    var xsltProcessor = new XSLTProcessor();    
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    var resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;

}

////////////////////////////////////////////////////////////////////////////////

async function refresh () {

	let body = get_textarea ().value

	let doc = new DOMParser ().parseFromString (body, 'application/xml')

	if (doc.querySelector ('parsererror')) {
	
		try {
		
			JSON.parse (body)
			
			const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16)}
			)

			await fetch ('/_back/?type=send_request&action=register&id=' + id, {method: 'POST', body})

			let response = await fetch ('/_back/?type=get_response&action=reply_to&id=' + id, {method: 'POST'})
			
			let j = await response.json ()

			say (prettifyXml (j.content))

			response = await fetch ('/_back/?type=ack&action=reply_to&id=' + id, {method: 'POST'})

			console.log (await response.json ())

		}
		catch (e) {
		
			console.log (e)

			say (' <-- Это должно быть либо SOAP-сообщение, либо объект JSON')
		
		}		

	}
	else {
		
		let response = await fetch ('/_back/?type=soap_message&part=json', {method: 'POST', body})
  
  		let {content} = await response.json ()
  		
  		if (typeof content !== 'string') content = JSON.stringify (content, null, 2)
  		
  		say (content)
	
	}

}

////////////////////////////////////////////////////////////////////////////////

function schedule () {

	setTimeout (refresh, 10)

}

////////////////////////////////////////////////////////////////////////////////

function load () {

	let reader = new FileReader ()
	
	reader.addEventListener ('load', () => {
	
		get_textarea ().value = reader.result
		
		refresh ()
		
	})
	
	reader.readAsText (get_file_input ().files [0])

}

////////////////////////////////////////////////////////////////////////////////

function move () {

	get_textarea ().value = get_pre ().textContent
	
	refresh ()

}

////////////////////////////////////////////////////////////////////////////////

async function copy () {

	const doc = get_frame ('right'), sel = doc.getSelection ()

	sel.selectAllChildren (get_pre ())

	doc.execCommand ('copy')
	
	sel.removeAllRanges ()
	
	alert ('Ответ скопирован в буфер обмена')

}

////////////////////////////////////////////////////////////////////////////////

function main () {

	get_file_input ().addEventListener ('change', load)
	
	const trigger_file_open = () => get_file_input ().click ()

	get_textarea ().addEventListener ('dblclick', trigger_file_open)
	
	get_button ('left', 'load').addEventListener ('click', trigger_file_open)
	get_button ('right', 'move').addEventListener ('click', move)
	get_button ('right', 'copy').addEventListener ('click', copy)

	for (let event of ['change', 'paste'])

		get_textarea ().addEventListener (event, schedule)

}
