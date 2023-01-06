module.exports = {

////////////////////////////////////////////////////////////////////////////////

select_users:

    async function () {

		return this.db.do ('SELECT * FROM users WHERE login=$1 ORDER BY label', ['do'])

    },

}