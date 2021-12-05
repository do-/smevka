////////////////////////////////////////////////////////////////////////////////

function get_textarea () {

	return document.querySelectorAll ('textarea') [0]

}

////////////////////////////////////////////////////////////////////////////////

function get_file_input () {

	return document.querySelectorAll ('input[type=file]') [0]

}

////////////////////////////////////////////////////////////////////////////////

function say (s) {

	document.querySelector ('pre').textContent = s;

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

			await fetch ('/_back/?type=send_request&action=register', {method: 'POST', body})

			let response = await fetch ('/_back/?type=get_response&action=reply_to', {method: 'POST'})
			
			let j = await response.json ()

console.log (j)
			say (prettifyXml (j.content))

		}
		catch (e) {
		
			say (' <-- here MUST be either a SOAP message or a JSON object')
		
		}		

	}
	else {
		
		let response = await fetch ('/_back/?type=soap_message&part=json', {method: 'POST', body})
  
  		let {content} = await response.json ()
  		
  		say (JSON.stringify (content, null, 2))
	
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

function main () {

	get_file_input ().addEventListener ('change', load)

	get_textarea ().addEventListener ('dblclick', () => get_file_input ().click ())

	for (let event of ['change', 'paste'])

		get_textarea ().addEventListener (event, schedule)

}
