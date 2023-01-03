const Path = require ('path')

const conf = require (process.argv [2] || Path.join (__dirname, '..', 'conf', 'elud.json'))

if (!('requests' in conf)) conf.requests = {}
if (isNaN (conf.requests.max)) conf.requests.max = 1000

if (!('responses' in conf)) conf.responses = {}        
if (isNaN (conf.responses.empty_rate)) conf.responses.empty_rate = 0

if (conf.ftp) {
	if (!conf.ftp.UserName) conf.ftp.UserName = conf.ftp.login
	if (!conf.ftp.Password) conf.ftp.Password = conf.ftp.password
}

module.exports = conf