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
	
////////////////////////////////////////////////////////////////////////////////

get_json_of_soap_message:

	async function () {
	
    	let {rq: {xml}} = this, stack = [], m2o = map => Object.fromEntries (map.entries ())
		
		let on = () => stack.push ([new Map (), '']); on ()
		
		let app = value => {
		
			value = value.replace (/\s+/g, ' ').trim (); if (!value) return
			
			stack [stack.length - 1] [1] += value
			
		}
		
		let set = (key, value) => {
			
			if (/^x(mlns|si:)\b/.test (key)) return
			
			let pos = key.indexOf (':'); if (pos > -1) key = key.slice (pos + 1)

			let [map] = stack [stack.length - 1]

			if (!map.has (key)) return map.set (key, value)

			let box = map.get (key); if (!Array.isArray (box)) map.set (key, box = [box])
	
			box.push (value)

 		}
		
		let off = name => {
		
			let [map, txt] = stack.pop ()
			
			set (name, map.size ? m2o (map) : txt)
		
		}				
		
		await new Promise ((ok, fail) => new Saxophone ().on ('error', fail).on ('finish', ok)			
			.on ('text',     o => app (o.contents))
			.on ('tagclose', tag => off (tag.name))
			.on ('tagopen',  tag => {
				on ()
				for (let [k, v] of Object.entries (Saxophone.parseAttrs (tag.attrs))) set (k, v)
				if (tag.isSelfClosing) off (tag.name)
			})
			.parse (xml)
		)
		
		let result = m2o (stack [0] [0])
		
		let get_message_primary_content = o => {

			if (typeof o != 'object') return null

			let e = Object.entries (o); if (!e.length) return null

			for (let [k, v] of e) {

				if (k == 'MessagePrimaryContent') return v

				let c = get_message_primary_content (v); if (c) return c

			}

			return null

		}
		
		return get_message_primary_content (result)
	
	}
        
}