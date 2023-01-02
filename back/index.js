const Path = require ('path')
const {HttpRouter, HttpJobSource, HttpParamReader, HttpStaticSite, HttpResultWriter} = require ('doix-http')

global.darn = s => console.log (s)

//darn (require.cache)

const sts = new HttpStaticSite ({
	root: Path.join (__dirname, '..', 'front', 'root'),
}).on ('error', darn)

const router = new HttpRouter ({listen: {port: 8000}})
	.add (sts)

router.listen ()