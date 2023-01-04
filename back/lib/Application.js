const Path = require ('path')
const {XMLSchemata} = require ('xml-toolkit')
const {LegacyApplication} = require ('doix-legacy')
const winston    = require ('winston')

const BackService = require ('./BackService.js')
const MockService = require ('./MockService.js')

const xs_smev = new XMLSchemata (Path.join (__dirname, 'Static', 'smev-message-exchange-service-1.1.xsd'))










	const off = (new Date ()).getTimezoneOffset (), lag = off * 60000

	const TZ_HH_MM =
		(off > 0 ? '-' : '+') +
		(new Date (2000, 1, 1, 0, -2 * off, 0))
			.toJSON ()
			.slice (11, 16)

	

class ConsoleLogger {

	log ({message, level}) {
	
		let s = (new Date (Date.now () - lag)).toISOString ().slice (0, 23) + TZ_HH_MM

		s += ' ' + (level || 'info')
		
		if (message) s += ' ' + message
	
		console.log (s)

	}

}






class EventLogger {

	constructor (emitter) {

		this.now = Date.now ()

		for (const name of Object.getOwnPropertyNames (Object.getPrototypeOf (this))) 

			if (name.slice (-7) === 'Message')

				emitter.on (name.slice (0, -7), (j, p) => 

					this.logger.log (this [name] (p))

				)

	}
	
	message (message, level = 'info') {
	
		const {prefix} = this
	
		if (prefix) message = prefix + ' ' + message
		
		return {level, message}
		
	}
	
}

class JobEventLogger extends EventLogger {

	constructor (job) {
	
		super (job)

		this.now = Date.now ()

		this.job = job
		
		this.logger = job.logger
			
	}
	
	get prefix () {

		let j = this.job, p = j.uuid
		
		while (j = j.parent) p = j.uuid + '/' + p
		
		return p

	}
		
	startMessage () {
	
		return this.message ('>')
		
	}

	methodMessage (m) {
	
		return this.message (m + ' ' + JSON.stringify (this.job.rq))
		
	}

	errorMessage () {
	
		const {error} = this.job

		let s; if (error instanceof Error) {
		
			s = error.stack.split ('\n').map (s => s.trim ()).join (' ').trim ()
		
		}
		else {
		
			s = '' + error
		
		}
	
		return this.message (s, 'error')
		
	}

	finishMessage () {

		return this.message ('< ' + (Date.now () - this.now) + ' ms')

	}

}














module.exports = class extends LegacyApplication {

	constructor (conf) {
	
	
	
	
	
	
	
const logger = winston.createLogger ({
	transports: [
//		new winston.transports.Console(),
		new winston.transports.File ({filename: conf.logs + '/app.log'})
	],
	format: winston.format.combine(
		winston.format.timestamp ({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
		winston.format.printf (
			info => `${info.timestamp} [${info.level}]: ${info.message}`
		)
	),
})	
	
	
	
	
	
	

	    super ({
	    
			globals: {
				conf,
				last: new Map (),
				xs_smev,
				logger//: new ConsoleLogger (),
			},
			
			generators: {			
				eventLogger: job => new JobEventLogger (job),
			},

			modules: {
				dir: {
					root: [
						__dirname,
						Path.join (__dirname, '..', '..', 'slices')
					],
//					live: true,
				},
//				watch: true,
			},

	    })

	}
	
	createBackService (o) {
	
		return new BackService (this, o)
	
	}

	createMockService (o) {
	
		return new MockService (this, o)
	
	}

}