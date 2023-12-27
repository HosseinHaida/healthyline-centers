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

const fetchOverview = async (req, res) => {
  const { user_id } = req.user

  try {
    const center_initial = await db("center_initials")
      .select(
        "id",
        "registration_name",
        "created_by",
        "created_at",
        "updated_by"
      )
      .where({ created_by: user_id })
      .first()

    if (center_initial) {
      const center_legals = await db("center_legals")
        .select(
          "id",
          "registration_name",
          "created_by",
          "created_at",
          "updated_by"
        )
        .where({ center_id: center_initial.id })
      successMessage.center_legals = center_legals
    }

    successMessage.center_initial = center_initial
    return res.status(status.success).send()
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = { fetchOverview }
