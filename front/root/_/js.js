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

function refresh () {

	let txt = get_textarea ().value

	let doc = new DOMParser ().parseFromString (txt, 'application/xml')

	if (doc.querySelector ('parsererror')) {

		say ('XML?')

	}
	else {
	
		let [form] = document.querySelectorAll ('form')
		
		form.submit ()

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
