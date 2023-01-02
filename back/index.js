const Path = require ('path')
const {XMLParser, XMLNode, XMLSchemata} = require ('xml-toolkit')
const {Application} = require ('doix')
const {HttpRouter, HttpJobSource, HttpParamReader, HttpStaticSite, HttpResultWriter} = require ('doix-http')

const dump = XMLNode.toObject ()
const parse = xml => new XMLParser ().process (xml)

const last = new Map ()
const xs_smev = new XMLSchemata ('./lib/Static/smev-message-exchange-service-1.1.xsd')

global.darn = s => console.log (s)

const conf = require (process.argv [2] || './conf/elud.json')

const staticSite = new HttpStaticSite ({
	root: Path.join (__dirname, '..', 'front', 'root'),
}).on ('error', darn)




const app = new Application ({

	modules: {
		dir: {
			root: [
				__dirname,
				Path.join (__dirname, '..', 'slices')
			],
			filter: (str, arr) => arr.at (-1) === 'Content',
			live: true,
		},
		watch: true,
	},

})












let inject

async function fork (tia, data = {}) {

	const job = this, {app} = job, {merger} = app.modules

	const j = job.app.createJob ()
	
	
	for (const o of [job.rq, tia, data]) for (const k in o) j.rq [k] = o [k]

	if ('part' in tia) delete j.rq.action
	if ('action' in tia) delete j.rq.part

	inject (j)

	return j.toComplete ()

}

inject = job => {
	job.uuid = Math.random ()
	job.last = last
	job.xs_smev = xs_smev
	job.fork = fork
	job.conf = conf
}





const svcBack = new HttpJobSource (app, {

	test: ({request: {url}}) => url.indexOf ('/_back/?') === 0,

	methods: ['POST'],
	
	reader: new HttpParamReader ({
		from: {
			searchParams: true,
			bodyString: (body, job) => {
			
				job.body = body	
				
				if (body.trim ().charAt (0) === '<') {

					this.body_document = dump (parse (this.body))

					let {rq} = this; if (!rq.type) {

						const {Body} = this.body_document; if (Body) {

							rq.action = 'reply_to'

							for (const k in Body) switch (k) {
								case 'SendRequestRequest': 
									rq.type = 'send_request'
									break
								case 'GetResponseRequest': 
									rq.type = 'get_response'
									break
								case 'AckRequest': 
									rq.type = 'ack'
									break
							}
						
						}

					}

				}
								
				return {}
				
			}	
			
		}

	}),
	
	writer: new HttpResultWriter ({
		type: 'application/json',
		stringify: content => JSON.stringify ({
			success: true, 
			content: content, 
        })
	}),

	dumper: new HttpResultWriter ({
		code: e => e.statusCode || 500,
		type: 'application/json',
		stringify: (err, job) => {darn (err);  JSON.stringify ({
			success: false, 
			id: job.uuid,
			dt: new Date ().toJSON ()
        })}
	}),

	on: {
		start: inject		
	},

})

{

	const {listen} = conf

	const router = new HttpRouter ({listen})
		.add (svcBack)
		.add (staticSite)

	router.listen ()

}

