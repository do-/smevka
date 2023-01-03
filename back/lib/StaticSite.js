const Path = require ('path')
const {HttpStaticSite} = require ('doix-http')

const root = Path.join (__dirname, '..', '..', 'front', 'root')

module.exports = class extends HttpStaticSite {

	constructor () {
	
	    super ({root})

	}

}