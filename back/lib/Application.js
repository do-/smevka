const Path = require ('path')
const {XMLSchemata} = require ('xml-toolkit')
const {LegacyApplication} = require ('doix-legacy')
 
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
	
		return this.message ('' + this.job.error, 'error')
		
	}

	finishMessage () {

		return this.message ('< ' + (Date.now () - this.now) + ' ms')

	}

}

module.exports = class extends LegacyApplication {

	constructor (conf) {

	    super ({
	    
			globals: {
				conf,
				last: new Map (),
				xs_smev,
				logger: new ConsoleLogger (),
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