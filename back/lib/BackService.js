const {HttpJobSource, HttpParamReader, HttpResultWriter} = require ('doix-http')

module.exports = class extends HttpJobSource {

	constructor (app, o = {}) {
	
	    super (app, {
	    
			methods: ['POST'],

			reader: new HttpParamReader ({
				from: {
					searchParams: true,
					bodyString: (body, job) => {			
						job.body = body					
						return {}
					}				
				}
			}),

			writer: new HttpResultWriter ({
				type: 'application/json',
				stringify: content => JSON.stringify ({
					success: true, 
					content, 
				})
			}),

			dumper: new HttpResultWriter ({
				code: e => 500,
				type: 'application/json',
				stringify: (err, job) => JSON.stringify ({
					success: false, 
					id: job.uuid,
					dt: new Date ().toJSON ()
				})
			}),
			
			...o

	    })

	}

}