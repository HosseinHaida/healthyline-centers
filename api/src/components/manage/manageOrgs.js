const db = require(".././../../db").Instance()
// const moment = require("moment")
const { catchError } = require("../../tools/catchError")

const { successMessage, status } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")

const fetchOrgs = async (req, res) => {
  const { org_status } = req.params
  try {
    const list = await db("orgs")
      .select("*")
      .join(
        "orgs_checklist_approval",
        "orgs.id",
        "=",
        "orgs_checklist_approval.org_id"
      )
      .join("centers", "orgs.center_id", "=", "centers.id")

    successMessage.list = list
    res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = { fetchOrgs }
