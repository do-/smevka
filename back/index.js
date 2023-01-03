const Path = require ('path')
const {XMLParser, XMLNode, XMLSchemata, SOAP11, SOAPFault} = require ('xml-toolkit')
const {Application} = require ('doix')
const {HttpRouter, HttpJobSource, HttpParamReader, HttpStaticSite, HttpResultWriter} = require ('doix-http')

const dump = XMLNode.toObject ()
const parse = xml => new XMLParser ().process (xml)

const last = new Map ()
const xs_smev = new XMLSchemata ('./lib/Static/smev-message-exchange-service-1.1.xsd')

global.darn = s => console.log (s)

const conf = require (process.argv [2] || './conf/elud.json')

{
        if (!('requests' in conf)) conf.requests = {}
        if (isNaN (conf.requests.max)) conf.requests.max = 1000
        
        if (!('responses' in conf)) conf.responses = {}        
        if (isNaN (conf.responses.empty_rate)) conf.responses.empty_rate = 0

		if (conf.ftp) {
			if (!conf.ftp.UserName) conf.ftp.UserName = conf.ftp.login
			if (!conf.ftp.Password) conf.ftp.Password = conf.ftp.password
		}

}

const staticSite = new HttpStaticSite ({
	root: Path.join (__dirname, '..', 'front', 'root'),
}).on ('error', darn)
















async function fork (tia, data = {}) {

	const job = this, {app} = job, {merger} = app.modules

	const j = job.app.createJob ()
	
	
	for (const o of [job.rq, tia, data]) for (const k in o) j.rq [k] = o [k]

	if ('part' in tia) delete j.rq.action
	if ('action' in tia) delete j.rq.part

	return j.toComplete ()

}

async function call (k) {
	
	const f = this.module [k]
	
	return f.call (this)
	
}


const app = new Application ({

	globals: {
		last,
		xs_smev,
		fork,
		conf,
		call,
	},

	generators: {
		uuid: () => Math.random ()
	},

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







const svcBack = new HttpJobSource (app, {

	test: ({request: {url}}) => url.indexOf ('/_back/') === 0,

	methods: ['POST'],
	
	reader: new HttpParamReader ({
		from: {
			searchParams: true,
			bodyString: (body, job) => {			
				job.body = body					
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
		stringify: (err, job) => {darn (err); return JSON.stringify ({
			success: false, 
			id: job.uuid,
			dt: new Date ().toJSON ()
        })}
	}),

})





const SMEV_RQ_TYPE = {
	'SendRequestRequest': 'send_request',
	'GetResponseRequest': 'get_response',
	'AckRequest'        : 'ack',
}

const svcMock = new HttpJobSource (app, {

	test: ({request: {url}}) => url.indexOf ('/_mock/') === 0,
	
	methods: ['POST'],
	
	reader: new HttpParamReader ({
	
		from: {		
			searchParams: false,			
			bodyString: (body, job) => {			
				job.body = body					
				job.body_document = dump (parse (body))
				return {
					type: SMEV_RQ_TYPE [Object.keys (job.body_document.Body)[0]],
					action: 'reply_to',
				}				
			}				
		}

	}),

	writer: new HttpResultWriter ({
		type: SOAP11.contentType,
		stringify: data => SOAP11.message (xs_smev.stringify (data))
	}),

	dumper: new HttpResultWriter ({
		code: 500,
		type: SOAP11.contentType,
		stringify: (x, job) => {darn (x);
    		if ('detail' in x) x.detail = xs_smev.stringify (x.detail)
    		return SOAP11.message (new SOAPFault (x))		
		}
	}),

	on: {
		start: job => {
			job.croak = (o) => {				
			    const [[k, v]] = Object.entries (o)
				let	x = new Error (v)				
				x.detail = {[k]: {}}			
				throw x				
			}
		}
	},

})








{

	const {listen} = conf

	const router = new HttpRouter ({listen})
		.add (svcBack)
		.add (svcMock)
		.add (staticSite)

	router.listen ()

}

