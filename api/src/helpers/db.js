const db = require("../../db").Instance()

/**
 * Where clause for DB queries
 */
const whereClause = (col, srch_txt) =>
  `LOWER(${col}) LIKE '%${srch_txt.toLowerCase()}%'`
const arrayWhereClause = (col, srch_txt) =>
  `LOWER(array_to_string(${col}, ', ')) LIKE '%${srch_txt.toLowerCase()}%'`

const fetchThisUser = async (value) =>
  await db
    .select("*")
    .from({ u: "users" })
    .where(function () {
      this.where("u.phone", value).orWhere("u.username", value)
    })
    .first()

const checkIfAdmin = async (id, res) => {
  const ifAdmin = await db("users")
    .select("phone", "username")
    .where({ id, is_admin: true })

  return ifAdmin.length < 1 ? false : true
}

module.exports = {
  whereClause,
  arrayWhereClause,
  fetchThisUser,
  checkIfAdmin,
}
