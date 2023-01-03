const Path = require ('path')
const {XMLSchemata} = require ('xml-toolkit')
const {Application} = require ('doix')
const BackService = require ('./BackService.js')
const MockService = require ('./MockService.js')

const {
	v4: uuidv4,
	validate: uuidValidate,
	NIL: NIL_UUID,
} = require ('uuid')

global.is_uuid = uuidValidate
global.ZERO_UUID = NIL_UUID

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

module.exports = class extends Application {

	constructor (conf) {

	    super ({
	    
			globals: {
				conf,
				last: new Map (),
				xs_smev: new XMLSchemata (Path.join (__dirname, 'Static', 'smev-message-exchange-service-1.1.xsd')),
				fork,
				call,
			},

			generators: {
				uuid: () => uuidv4 ()
			},

			modules: {
				dir: {
					root: [
						__dirname,
						Path.join (__dirname, '..', '..', 'slices')
					],
					filter: (str, arr) => arr.at (-1) === 'Content',
					live: true,
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