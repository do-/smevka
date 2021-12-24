module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_rsid_of_export_debt_requests:

    function () {

		return 30441
    
    },

////////////////////////////////////////////////////////////////////////////////

get_response_of_export_debt_requests:

    function () {
    
    	let {rq: {data}} = this

		let ids = data ["request-id"]; if (!Array.isArray (ids)) ids = [ids]

		let request_data = ids.map (request_id => {
		
			return {
				"request-id" : request_id,
				"request-number" : "022021173",
				"applicant-info" : {
				   "firstname" : "Иван",
				   "lastname" : "Иванов",
				   "middlename" : "Иванович",
				   "snils" : "11111111145",
				   "document" : {
					  "type" : "1",
					  "series" : "1234",
					  "number" : "123456"
				   }
				},
				"housing-fund-object" : {
				   "house-id" : "e786b770-28e6-4557-8dde-86e8e347587e",
				   "address-details" : "кв. 27",
				   "fias-house-id" : "497cdeef-0388-466b-a063-36f51d94800c",
				   "address" : "153045, Ивановская обл, г. Иваново, ул. 3 Июня, д. 14"
				},
				"period" : {
				   "start-date" : "2018-02-01+03:00",
				   "end-date" : "2021-01-31+03:00"
				},
				"organization" : {
				   "organization-root-id" : "6eef689e-48bb-4eb0-9c11-18b6db9909b7",
				   "name" : "Администрация г. Иваново",
				   "tel" : "+7(4932)32-80-83"
				},
				"executor-info" : {
				   "id" : "84b12e02-6ad8-11eb-9439-0242ac130002",
				   "fio" : "Четвертак Иван Иванович"
				},
/*
				"status" : "SENT",
				"result" : "2",
*/

				"status" : "PROCESSED",
				"result" : "4",
				
				"creation-date" : "2021-02-04+03:00",
				"sent-date" : "2021-02-04+03:00",
				"response-date" : "2021-02-08+03:00",
				"subrequest" : {
				   "organization" : {
					  "organization-root-id" : "ad50290c-6ad9-11eb-9439-0242ac130002",
					  "name" : "УК ООО \"ГУЖФ\"",
					  "tel" : "8-800-200-50-58"
				   },
				   "response" : {
					  "type" : "PROVIDED",
					  "has-debt" : "false",
					  
						"debt-info" : [
							{
							
								person: {
								   "firstname" : "Петр",
								   "lastname" : "Петров",
								   "middlename" : "Петрович",
								   "snils" : "11111111146",
								   "document" : {
									  "type" : "1",
									  "series" : "1235",
									  "number" : "123455"
								   }
								},
								
								"_document" : [
									{
								     	"type" : "1",
								     	"attachment" : {
											"metadata" : {
											   "name" : "Анализ 18-20.pdf",
											   "description" : "foo"
											},
											"smev-attachment-ref-guid": "78d9e04a-4ebe-11ec-977f-005056b665bf",
								        }
									},
									{
								     	"type" : "2",
								     	"attachment" : {
											"metadata" : {
											   "name" : "Анализ 20-21.pdf",
											   "description" : "bar"
											},
											"smev-attachment-ref-guid": "78cbaf77-4ebe-11ec-977f-005056b665bf",
								        },
									},									
								]
							},
							{person: 
								{
								   "firstname" : "Сидор",
								   "lastname" : "Сидоров",
								   "middlename" : "Сидорович",
								   "snils" : "11111111146",
								   "document" : {
									  "type" : "1",
									  "series" : "1235",
									  "number" : "123455"
								   }
								},
							},
						],
					  
					  "executor-info" : {
						 "id" : "38a794b8-6ada-11eb-9439-0242ac130002",
						 "fio" : "Герасимова Ольга Ивановна"
					  }
				   }
				}

			}
		
		})

    	return {
    	
    		ExportDebtRequestsResponse: {"request-data": request_data},
    		
    		_FSAttachmentsList: [
    			{uuid: '78cbaf77-4ebe-11ec-977f-005056b665bf', FileName: '/78cbaf77-4ebe-11ec-977f-005056b665bf.zip'},
    			{uuid: '78d9e04a-4ebe-11ec-977f-005056b665bf', FileName: '/78d9e04a-4ebe-11ec-977f-005056b665bf.zip'},
    		],
    		
    	}

    },
        
}