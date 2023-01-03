const {Application, ObjectMerger} = require ('doix')
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

	constructor (o = {}) {
	
		(new ObjectMerger ()).merge (o, {

			globals: {
				fork,
				call,
			},

			generators: {
				uuid: () => uuidv4 ()
			},

			modules: {
				dir: {
					filter: (str, arr) => arr.at (-1) === 'Content',
				},
			},

		})

	    super (o)

	}

}