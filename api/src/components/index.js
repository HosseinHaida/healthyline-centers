const db = require("../../db").Instance()
const moment = require("moment")
const { catchError } = require("../tools/catchError")

const { isEmpty } = require("../helpers/validations")
const { successMessage, status, error } = require("../helpers/status")
const { errMessages } = require("../helpers/errMessages")
const { p2e } = require("../helpers/strings")

const fetchProgress = async (req, res) => {
  const { user_id } = req.user
  try {
    let progress = {}
    //
    const center_initial = await db("centers")
      .select("id", "created_by", "created_at")
      .where({ created_by: user_id })
      .first()
    if (!center_initial) {
      progress = { initials: { isNext: true } }
      successMessage.progress = progress
      return res.status(status.success).send(successMessage)
    } else progress = { initials: { complete: true } }
    //
    const center_legals = await db("center_legals")
      .select("approved_at")
      .where({ center_id: center_initial.id })
    if (isEmpty(center_legals)) {
      progress = {
        ...progress,
        legals: { isNext: true },
      }
      successMessage.progress = progress
      return res.status(status.success).send(successMessage)
    } else {
      progress = {
        ...progress,
        legals: { complete: true },
        legals_approval: {
          count: 0,
          totalCount: center_legals.length,
        },
      }
      center_legals.forEach((l) => {
        if (!isEmpty(l.approved_at)) progress.legals_approval.count++
      })
      if (
        progress.legals_approval.count === progress.legals_approval.totalCount
      )
        progress.legals_approval.complete = true
    }
    //
    const center_certs = await db("center_certs")
      .select("approved_at")
      .where({ center_id: center_initial.id })
    if (isEmpty(center_certs)) {
      progress = {
        ...progress,
        certs: { isNext: true },
      }
      successMessage.progress = progress
      return res.status(status.success).send(successMessage)
    } else {
      progress = {
        ...progress,
        certs: { complete: true },
        certs_approval: {
          count: 0,
          totalCount: center_certs.length,
        },
      }
      center_certs.forEach((l) => {
        if (!isEmpty(l.approved_at)) progress.certs_approval.count++
      })
      if (progress.certs_approval.count === progress.certs_approval.totalCount)
        progress.certs_approval.complete = true
    }
    //
    const center_specialists = await db("center_specialists")
      .select("created_at")
      .where({ center_id: center_initial.id })
    if (isEmpty(center_specialists)) {
      progress = {
        ...progress,
        specialists: { isNext: true },
      }
      successMessage.progress = progress
      return res.status(status.success).send(successMessage)
    } else {
      progress = {
        ...progress,
        specialists: { complete: true },
      }
    }
    //
    const center_equipments = await db("center_equipments")
      .select("created_at")
      .where({ center_id: center_initial.id })
    if (isEmpty(center_equipments)) {
      progress = {
        ...progress,
        equipments: { isNext: true },
      }
      successMessage.progress = progress
      return res.status(status.success).send(successMessage)
    } else {
      progress = {
        ...progress,
        equipments: { complete: true },
      }
    }
    successMessage.progress = progress
    return res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = { fetchProgress }
