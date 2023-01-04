const Path = require ('path')
const {XMLSchemata} = require ('xml-toolkit')
const {JobEventLogger} = require ('doix')
const {LegacyApplication} = require ('doix-legacy')
const winston    = require ('winston')

const BackService = require ('./BackService.js')
const MockService = require ('./MockService.js')

const xs_smev = new XMLSchemata (Path.join (__dirname, 'Static', 'smev-message-exchange-service-1.1.xsd'))

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