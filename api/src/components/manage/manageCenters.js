const db = require(".././../../db").Instance()
// const moment = require("moment")
const { catchError } = require("../../tools/catchError")

const { successMessage, status } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")

const fetchCenters = async (req, res) => {
  try {
    const list = await db("centers")
      .select(
        "centers.*",
        "users.first_name as login_first_name",
        "users.last_name as login_last_name",
        "users.id as login_id",
        "users.center_id",
        "users.phone as login_phone"
      )
      .join("users", "centers.id", "=", "users.center_id")

    successMessage.list = list
    res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = { fetchCenters }
