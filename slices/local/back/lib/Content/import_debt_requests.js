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
    
    	let result = data.action.map (i => ({
    		[TID]: i [TID],
    		success: {
    			id: i [TID],
    			"update-date" : (new Date ()).toJSON ()
    		}
    	}))

    	return {ImportDebtRequestsResponse: {result}}

    },
        
}