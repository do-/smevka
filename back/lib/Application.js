const Path = require ('path')
const {XMLSchemata} = require ('xml-toolkit')
const {LegacyApplication} = require ('doix-legacy')
 
const BackService = require ('./BackService.js')
const MockService = require ('./MockService.js')

const xs_smev = new XMLSchemata (Path.join (__dirname, 'Static', 'smev-message-exchange-service-1.1.xsd'))


class ConsoleLogger {

	log ({message, level}) {
	
		console.log ([
			new Date ().toISOString(), 
			level || 'info',
			message
		].join (' ').trim ())

	}

}

class EventLogger {

	constructor (job) {

		this.now = Date.now ()

		this.job = job
		
		this.logger = job.logger

		for (const name of Object.getOwnPropertyNames (Object.getPrototypeOf (this))) 

			if (name.slice (-7) === 'Message')

				job.on (name.slice (0, -7), (j, p) => 

					this.logger.log (this [name] (p))

				)

	}

	getPrefix () {
	
		let s = '', j = this.job
		
		while (j) {
			
			s = !s ? j.uuid : j.uuid + '/' + s

			j = j.parent
			
		}

		return s

	}

	message (message, level = 'info') {
	
		const pre = this.getPrefix ()
	
		if (pre) message = pre + ' ' + message
		
		return {level, message}
		
	}
		
	startMessage () {
		return this.message ('>')
	}

	methodMessage (m) {
		return this.message (m + ' ' + JSON.stringify (this.job.rq))
	}

	errorMessage (m) {
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
				eventLogger: job => new EventLogger (job),
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