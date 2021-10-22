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
darn (data)
    	return {
    		ImportDebtRequestsResponse: {
				"result" : {
					"transport-id" : "be03eb8e-6f80-11eb-9439-0242ac130002",
						"success" : {
							"id" : "3d62cf5c-66d6-11eb-ae93-0242ac130002",
							"update-date" : "2021-02-04T13:45:47.000+03:00"
						}
				}
			}
		}
    
    },
        
}