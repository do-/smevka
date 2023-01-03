global.darn = s => console.log (s)

const Path = require ('path')

const {HttpRouter} = require ('doix-http')

const conf = require ('./lib/Conf.js')

const Application = require ('./lib/Application.js')

const BackService = require ('./lib/BackService.js')
const MockService = require ('./lib/MockService.js')
const StaticSite  = require ('./lib/StaticSite.js')

const app = new Application (conf)

const {listen} = conf; new HttpRouter ({listen})
	.add (new BackService (app, {location: '/_back'}))
	.add (new MockService (app, {location: '/_mock'}))
	.add (new StaticSite ())
	.listen ()


