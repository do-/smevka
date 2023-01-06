const pg = require ('pg')

const ResourcePool = require ('./ResourcePool.js')
const DbClientPg   = require ('./DbClientPg.js')

class DbPoolPg extends ResourcePool {

	constructor (conf) {
	
		super ()
		
		this.wrapper = DbClientPg

		this.pool = new pg.Pool (conf)
	
	}

	async acquire () {
	
		return this.pool.connect ()

	}

}

module.exports = DbPoolPg