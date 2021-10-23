////////////////////////////////////////////////////////////////////////////////

function get_textarea () {

	return document.querySelectorAll ('textarea') [0]

}

////////////////////////////////////////////////////////////////////////////////

function refresh () {

	let txt = get_textarea ().value

	let doc = new DOMParser ().parseFromString (txt, 'application/xml')

	if (doc.querySelector ('parsererror')) {
	
		document.querySelector ('iframe').contentWindow.document.write ('XML?')

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

function main () {

	for (let event of ['change', 'paste'])

		get_textarea ().addEventListener (event, schedule)

}
