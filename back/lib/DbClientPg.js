class DbClientPg {

	constructor (raw) {
	
		this.raw = raw
	
	}
	
	async release () {
	
		this.raw.release ()
	
	}
	
	async do (sql, params = [], options = {}) {
	
		return this.raw.query ({
			text: sql,
			values: params,
		})
	
	}

}

module.exports = DbClientPg