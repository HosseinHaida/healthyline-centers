const db = require("../../../db").Instance()
// const moment = require("moment")
const { catchError } = require("../../tools/catchError")

const { successMessage, status } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")
const { fetchThisUser } = require("../../helpers/db")

const fetchOrgs = async (req, res) => {
  const { user_id, username } = req.user

  try {
    const thisUser = await fetchThisUser(username)
    const list = await db("orgs")
      .select("*")
      .where({ center_id: thisUser.center_id })

    successMessage.list = list
    res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

const addOrg = async (req, res) => {
  const { user_id, username } = req.user
  const {
    orgCode: main_org_code,
    otherCodes: other_codes,
    name,
    size,
    province,
    city,
    loginFirstName: login_first_name,
    loginLastName: login_last_name,
    loginGender: login_gender,
    loginPhone: login_phone,
  } = req.body

  try {
    const thisUser = await fetchThisUser(username)

    if (!thisUser.is_center_auth)
      return catchError(errMessages.notAuthorized, "bad", res)

    await db("orgs").insert({
      main_org_code,
      other_codes,
      name,
      size,
      province,
      city,
      login_first_name,
      login_last_name,
      login_gender,
      login_phone,
      center_id: thisUser.center_id,
    })

    res.status(status.success).send()
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = { fetchOrgs, addOrg }
