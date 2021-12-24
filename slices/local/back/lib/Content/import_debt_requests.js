module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_rsid_of_import_debt_requests:

    function () {

		return 30442
    
    },

////////////////////////////////////////////////////////////////////////////////

get_response_of_import_debt_requests:

    function () {
    
    	let {rq: {data}} = this
    
    	const TID = 'transport-id'
    	
    	let {action} = data; if (!Array.isArray (action)) action = [action]

    	let result = action.map (i => ({
    		[TID]: i [TID],
    		
    		success: {
    			id: i [TID],
    			"update-date" : (new Date ()).toJSON ()
    		}

/*
			error: {
				'error-code': 'INT054018',
				'description': 'Для паспорта гражданина Российской Федерации необходимо указать: серию в виде строки из 4-х цифр и номер в виде строки из 6-и цифр.',
			}
*/
    	}))

    	return {ImportDebtRequestsResponse: {result}}

    },
        
}