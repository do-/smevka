const Path = require ('path')
const {XMLSchemata} = require ('xml-toolkit')
const {JobEventLogger} = require ('doix')
const {LegacyApplication} = require ('doix-legacy')
const winston    = require ('winston')

const BackService = require ('./BackService.js')
const MockService = require ('./MockService.js')

const xs_smev = new XMLSchemata (Path.join (__dirname, 'Static', 'smev-message-exchange-service-1.1.xsd'))

//const pg = require ('pg')
const DbPoolPg = require ('./DbPoolPg.js')

module.exports = class extends LegacyApplication {

	constructor (conf, logger) {


		const dbPool = new DbPoolPg (conf.db)



	    super ({
	    
			globals: {
				conf,
				last: new Map (),
				xs_smev,
				dbPool,
				logger//: new ConsoleLogger (),
			},
			
			generators: {			
				eventLogger: job => new JobEventLogger (job),
				db: job => dbPool.setProxy (job, 'db'),
			},

			modules: {
				dir: {
					root: [
						__dirname,
						Path.join (__dirname, '..', '..', 'slices')
					],
//					live: true,
				},
				watch: true,
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