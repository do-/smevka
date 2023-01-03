const Path = require ('path')
const Application = require ('./lib/Application.js')
const BackService = require ('./lib/BackService.js')
const MockService = require ('./lib/MockService.js')
const {HttpRouter, HttpStaticSite} = require ('doix-http')

global.darn = s => console.log (s)

const conf = require (process.argv [2] || './conf/elud.json')

{
        if (!('requests' in conf)) conf.requests = {}
        if (isNaN (conf.requests.max)) conf.requests.max = 1000
        
        if (!('responses' in conf)) conf.responses = {}        
        if (isNaN (conf.responses.empty_rate)) conf.responses.empty_rate = 0

		if (conf.ftp) {
			if (!conf.ftp.UserName) conf.ftp.UserName = conf.ftp.login
			if (!conf.ftp.Password) conf.ftp.Password = conf.ftp.password
		}

}

const staticSite = new HttpStaticSite ({
	root: Path.join (__dirname, '..', 'front', 'root'),
}).on ('error', darn)

const app = new Application (conf)

{

	const {listen} = conf

	new HttpRouter ({listen})
		.add (new BackService (app))
		.add (new MockService (app))
		.add (staticSite)
		.listen ()

}

