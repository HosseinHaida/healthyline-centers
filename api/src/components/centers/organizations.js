const db = require("../../../db").Instance()
const moment = require("moment")
const { catchError } = require("../../tools/catchError")

const { successMessage, status } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")
const { fetchThisUser } = require("../../helpers/db")
const { isValidPhone, isEmpty } = require("../../helpers/validations")

const fetchOrgs = async (req, res) => {
  const { user_id, username } = req.user

  try {
    const thisUser = await fetchThisUser(username)
    const list = await db("orgs")
      .select("*")
      .join(
        "orgs_checklist_approval",
        "orgs.id",
        "=",
        "orgs_checklist_approval.org_id"
      )
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

  if (
    isEmpty(main_org_code) ||
    isEmpty(name) ||
    isEmpty(size) ||
    isEmpty(province) ||
    isEmpty(city) ||
    isEmpty(login_first_name) ||
    isEmpty(login_last_name) ||
    isEmpty(login_gender) ||
    isEmpty(login_phone)
  )
    return catchError(errMessages.emptyFileds, "bad", res)

  try {
    const thisUser = await fetchThisUser(username)

    if (!thisUser.is_center_auth)
      return catchError(errMessages.notAuthorized, "bad", res)

    if (!isValidPhone(login_phone))
      return catchError(errMessages.notValidPhone, "bad", res)

    const created_at = moment(new Date())
    await db
      .transaction(async function (trx) {
        await db("orgs")
          .transacting(trx)
          .insert(
            {
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
            },
            "id" // return row id after pending insert
          )
          .then(async (resp) => {
            return await db("orgs_checklist_approval").transacting(trx).insert({
              status: "pending", // default value
              created_by: user_id,
              created_at,
              org_id: resp[0].id,
            })
          })
          .then(trx.commit)
          .catch(trx.rollback)
      })
      .then(
        (resp) => resp // Transaction Complete
      )
      .catch(function (err) {
        if (err.routine && err.routine === "_bt_check_unique") {
          return catchError(errMessages.phoneDuplicate, "conflict", res, err)
        }
        return catchError(errMessages.transactionFailed, "error", res, err)
      })

    res.status(status.success).send()
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = { fetchOrgs, addOrg }
