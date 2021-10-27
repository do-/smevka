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

async function refresh () {

	let body = get_textarea ().value

	let doc = new DOMParser ().parseFromString (body, 'application/xml')

	if (doc.querySelector ('parsererror')) {

		say ('XML?')

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
