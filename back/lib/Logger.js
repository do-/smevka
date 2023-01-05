const Path    = require ('path')
const winston = require ('winston')

function createLogger (conf, name) {

	const filename = Path.join (conf.logs, name + '.log')

	return winston.createLogger ({
		transports: [
//			new winston.transports.Console(),
			new winston.transports.File ({filename})
		],
		format: winston.format.combine(
			winston.format.timestamp ({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
			winston.format.printf (
				info => `${info.timestamp} [${info.level}]: ${info.message}`
			)
		),
	})

}

module.exports = createLogger