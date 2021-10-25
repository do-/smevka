const {Readable} = require ('stream')
const Saxophone = require ('saxophone')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_parse_soap_message:

    async function () {

    	let {rq: {xml}} = this

    	let prim = '', type, flag = false

    	const eat = s => !flag ? 0 : /^\s+$/.test (s) ? 0 : prim += s

    	const is_prim = tag => /^(\w+:)?MessagePrimaryContent$/.test (tag.name)

    	const from_name = tag =>
    		tag.name.split (':').pop ()        // if prefixed, local name only
			.replace (/Re(quest|sponse)$/, '') // method, not message name
			.replace (/[A-Z]/g,                // CamelCase to under_scores
				(m, o, s) => (o ? '_' : '') + m.toLowerCase ()
			)
    	
    	return new Promise ((ok, fail) => {

			new Saxophone ().on ('error', fail)
			
				.on ('text', o => eat (o.contents))

				.on ('tagopen', tag => {
					if (flag && !type) type = from_name (tag)
					eat (`<${tag.name}${tag.attrs}${tag.isSelfClosing ? '/' : ''}>`)
					if (is_prim (tag)) flag = true
				})

				.on ('tagclose', tag => {
					if (is_prim (tag)) flag = false
					eat (`</${tag.name}>`)
				})

				.on ('finish', () => ok ({prim, type}))

				.parse (xml)

    	})
    	
	},
        
}