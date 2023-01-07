const Path = require ('path')
const {XMLSchemata} = require ('xml-toolkit')
const {JobEventLogger} = require ('doix')
const {LegacyApplication} = require ('doix-legacy')
const winston    = require ('winston')

const BackService = require ('./BackService.js')
const MockService = require ('./MockService.js')

const xs_smev = new XMLSchemata (Path.join (__dirname, 'Static', 'smev-message-exchange-service-1.1.xsd'))

module.exports = class extends LegacyApplication {

	constructor (conf, db, logger) {

	    super ({
	    	
	    	logger,
	    
			globals: {
				conf,
				last: new Map (),
				xs_smev
			},

			pools: {
				db,
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