const db = require(".././../../db").Instance()
// const moment = require("moment")
const { catchError } = require("../../tools/catchError")

const { successMessage, status } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")

const fetchOrgs = async (req, res) => {
  const { org_status } = req.params
  try {
    const query = db("orgs")
      .select(
        "orgs.*",
        "orgs_checklist_approval.status",
        "orgs_checklist_approval.has_contracts_recently",
        "orgs_checklist_approval.is_center_unique",
        "orgs_checklist_approval.is_code_sync",
        "orgs_checklist_approval.is_login_info_correct",
        "orgs_checklist_approval.admin_comment",
        "centers.registration_name"
      )
      .join(
        "orgs_checklist_approval",
        "orgs.id",
        "=",
        "orgs_checklist_approval.org_id"
      )
      .join("centers", "orgs.center_id", "=", "centers.id")

    if (org_status) query.where({ status: org_status })

    const list = await query
    successMessage.list = list
    res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

const updateOrgStatus = async (req, res) => {
  const { user_id, username } = req.user
  const {
    org_id,
    hasContractsRecently: has_contracts_recently,
    isCenterUnique: is_center_unique,
    isCodeSync: is_code_sync,
    isLoginInfoCorrect: is_login_info_correct,
    adminComment: admin_comment,
    status: org_status,
  } = req.body

  try {
    await db("orgs_checklist_approval")
      .update({
        has_contracts_recently,
        is_center_unique,
        is_code_sync,
        is_login_info_correct,
        admin_comment,
        status: org_status,
      })
      .where({ org_id })
    res.status(status.success).send()
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = { fetchOrgs, updateOrgStatus }
