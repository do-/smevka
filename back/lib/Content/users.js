const util = require ('util')
const DbClientPg = require ('../DbClientPg.js')


module.exports = {

////////////////////////////////////////////////////////////////////////////////

select_users:

    async function () {


const {prototype} = DbClientPg
for (const k of Object.getOwnPropertyNames (prototype)) darn ([k, util.types.isAsyncFunction (prototype [k])])

		await this.dbPool.toSet (this, 'db')

		return this.db.do ('SELECT * FROM users WHERE login=$1 ORDER BY label', ['do'])

    },

}