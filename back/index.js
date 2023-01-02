const Path = require ('path')
const {HttpRouter, HttpJobSource, HttpParamReader, HttpStaticSite, HttpResultWriter} = require ('doix-http')

global.darn = s => console.log (s)

const conf = require (process.argv [2] || './conf/elud.json')

const staticSite = new HttpStaticSite ({
	root: Path.join (__dirname, '..', 'front', 'root'),
}).on ('error', darn)

{

	const {listen} = conf

	const router = new HttpRouter ({listen})
		.add (staticSite)

	router.listen ()

}

