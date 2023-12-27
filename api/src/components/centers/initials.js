const db = require(".././../../db").Instance()
const moment = require("moment")
// const fs = require("fs")
// const sharp = require("sharp")
const { catchError } = require("../../tools/catchError")

const {
  isEmpty,
  // containsPersian,
  // isAllPersian,
} = require("../../helpers/validations")
const { successMessage, status, error } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")
// const {
//   whereClause,
//   arrayWhereClause,
//   fetchThisUser,
//   checkIfAdmin,
// } = require("../../helpers/db")
const { p2e } = require("../../helpers/strings")

const addCenter = async (req, res) => {
  const { user_id } = req.user
  const {
    registrationName,
    brandName,
    gis,
    postalCode,
    exactAddress,
    phoneEntries,
    website,
  } = req.body

  try {
    const center_initial = await db("center_initials")
      .select("id", "created_by")
      .where({ created_by: user_id })
      .first()

    if (center_initial)
      return catchError(errMessages.alreadyAddedACenter, "bad", res)

    const created_at = moment(new Date())

    if (
      isEmpty(registrationName) ||
      isEmpty(brandName) ||
      isEmpty(gis) ||
      isEmpty(postalCode) ||
      isEmpty(exactAddress) ||
      isEmpty(phoneEntries)
    )
      return catchError(errMessages.emptyFileds, "bad", res)

    await db("center_initials").insert({
      registration_name: registrationName,
      brand_name: brandName,
      gis,
      postal_code: postalCode,
      exact_address: exactAddress,
      phone: phoneEntries,
      website: website,
      created_by: user_id,
      created_at,
    })

    return res.status(status.success).send()
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = { addCenter }
