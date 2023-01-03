global.darn = s => console.log (s)

const Path         = require ('path')
const {HttpRouter} = require ('doix-http')

const staticSite   = require ('./lib/StaticSite.js')
const conf         = require ('./lib/Conf.js')
const Application  = require ('./lib/Application.js')

const app = new Application (conf)

const {listen} = conf; new HttpRouter ({listen})
	.add (app.createBackService ({location: '/_back'}))
	.add (app.createMockService ({location: '/_mock'}))
	.add (staticSite)
	.listen ()