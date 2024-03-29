const winston    = require ('winston')
const Dia        = require ('./Ext/Dia/Dia.js')
const HTTP       = require ('./Ext/Dia/HTTP.js')
const LogEvent   = require ('./Ext/Dia/Log/Events/Text.js')
const {XMLSchemata} = require ('xml-toolkit')

module.exports = class extends Dia.Config {

    constructor () {
        
        super (process.argv [2] || '../conf/elud.json', 'utf8')
        
        this.pools = {
        	last: new Map (),
        	xs_smev: new XMLSchemata ('./Static/smev-message-exchange-service-1.1.xsd'),
        }

        if (!('requests' in this)) this.requests = {}
        if (isNaN (this.requests.max)) this.requests.max = 1000
        
        if (!('responses' in this)) this.responses = {}        
        if (isNaN (this.responses.empty_rate)) this.responses.empty_rate = 0

		if (this.ftp) {
			if (!this.ftp.UserName) this.ftp.UserName = this.ftp.login
			if (!this.ftp.Password) this.ftp.Password = this.ftp.password
		}

    }

    init_logging () {
    
    	let {logs} = this; if (!logs) throw new Error ('logs path not set')

    	this.logging_container = new winston.Container ()
    	
    	for (let category of ['app']) this.logging_container.add (category, {

			format: new Dia.Logger ({category}),

    		transports: [

				new winston.transports.File ({

					filename: `${this.logs}/${category}.log`

				})

    		]

    	})

		this.logging_event = this.log_event (new LogEvent ({
			phase: 'before',
			label: 'Loading application'
		}))

    }

	get_logger (category) {
	
		return this.logging_container.get (category)
	
	}

    log_info (label) {

		this.log_event (this.logging_event.set ({phase: null, label}))

    }
    
    async init () {
    
    	this.init_logging  ()
    
		this.log_event (this.logging_event.finish ())
    
    }

}