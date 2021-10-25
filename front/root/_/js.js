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

	let {document} = window.document.querySelector ('iframe').contentWindow
	
	document.open ()
	
	document.writeln ('<pre>')
	document.writeln (s)
	document.writeln ('</pre>')

}

////////////////////////////////////////////////////////////////////////////////

function get_message_primary_content (o) {

	if (typeof o != 'object') return null

	let e = Object.entries (o); if (!e.length) return null
	
	for (let [k, v] of e) {

		if (k == 'MessagePrimaryContent') return v
		
		let c = get_message_primary_content (v); if (c) return c
	
	}
	
	return null

}

////////////////////////////////////////////////////////////////////////////////

function el_to_obj (el) {

	let o = {}, txt = ''

	let {attributes, childNodes} = el

	for (let i = 0; i < attributes.length; i ++) {
		
		let a = attributes.item (i)
		
		if (/^x(mlns|si)/.test (a.name)) continue

		o [a.localName] = a.value
		
	}

	for (let i = 0; i < childNodes.length; i ++) {
		
		let n = childNodes.item (i); switch (n.nodeType) {
		
			case Node.TEXT_NODE:

				txt += n.wholeText.replace (/\s+/g, ' ').trim ()

				break
				
			case Node.ELEMENT_NODE:

				let [[k, v]] = Object.entries (el_to_obj (n))

				if (!(k in o)) {
					o [k] = v
				}
				else {
					if (!Array.isArray (o [k])) o [k] = [o [k]]
					o [k].push (v)
				}
				break

		}
		
	}

	return {[el.localName]: Object.keys (o).length == 0 ? txt : o}

}

////////////////////////////////////////////////////////////////////////////////

function refresh () {

	let txt = get_textarea ().value

	let doc = new DOMParser ().parseFromString (txt, 'application/xml')

	if (doc.querySelector ('parsererror')) {

		say ('XML?')

	}
	else {

		let o = el_to_obj (doc.documentElement)
		
		let c = get_message_primary_content (o)

		say (JSON.stringify (c, null, 2))

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
