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
	
		let local = s => {
		
			let pos = s.indexOf (':')
			
			return pos < 0 ? s : s.slice (pos + 1)
		
		}
	
		const what = 'MessagePrimaryContent', is_it = s => s == what
		
		let flag = false
	
    	let {rq: {xml}} = this, stack = []
		
		let on = () => stack.push ([new Map (), '']); on ()
		
		let app = value => {
				
			value = value.replace (/\s+/g, ' ').trim (); if (!value) return
			
			stack [stack.length - 1] [1] += value
			
		}
		
		let set = (key, value) => {
			
			let [map] = stack [stack.length - 1]

			if (!map.has (key)) return map.set (key, value)

			let box = map.get (key); if (!Array.isArray (box)) map.set (key, box = [box])
	
			box.push (value)

 		}
		
		let off = name => {

			let [map, txt] = stack.pop ()
			
			set (name, map.size ? Object.fromEntries (map.entries ()) : txt)
		
		}				
		
		await new Promise ((ok, fail) => new Saxophone ().on ('error', fail).on ('finish', ok)			
			.on ('text',     o => {
				if (flag) app (o.contents)
			})
			.on ('tagclose', tag => {
			
				let name = local (tag.name)
				
				if (!flag) return
				
				off (name)
				
				if (is_it (name)) flag = false
				
			})
			.on ('tagopen',  tag => {

				let name = local (tag.name)

				if (!flag && is_it (name)) flag = true
				
				if (!flag) return

				on ()

				for (let [name, value] of Object.entries (Saxophone.parseAttrs (tag.attrs))) 

					if (!/^x(mlns|si:)\b/.test (name)) 

						set (local (name), value)

				if (tag.isSelfClosing) off (name)
			
			})
			.parse (xml)
		)
		
		for (let v of stack [0] [0].values ()) return v
		
	}
        
}