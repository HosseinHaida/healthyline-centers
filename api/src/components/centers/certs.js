const db = require(".././../../db").Instance()
const moment = require("moment")
const multer = require("multer")
// const fs = require("fs")
// const sharp = require("sharp")
const { catchError } = require("../../tools/catchError")

const {
  isEmpty,
  // containsPersian,
  isAllPersian,
} = require("../../helpers/validations")
const { upload } = require("./upload.js")
const { successMessage, status, error } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")
// const {
//   whereClause,
//   arrayWhereClause,
//   fetchThisUser,
//   checkIfAdmin,
// } = require("../../helpers/db")
const { p2e } = require("../../helpers/strings")

const addCerts = async (req, res) => {
  const { user_id } = req.user

  let center_initial
  try {
    center_initial = await db("centers")
      .select("id", "created_by")
      .where({ created_by: user_id })
      .first()

    if (!center_initial)
      return catchError(errMessages.noCentersInitialized, "bad", res)
  } catch (error) {
    return catchError(errMessages.failedFetchingCenter, "error", res, error)
  }

  // Upload the photo as ../upload/centers/[user_id]/certs_[photoName]
  upload(req, res, async (err) => {
    const { name, type, expires_at } = req.body

    if (isEmpty(name) || isEmpty(type) || isEmpty(expires_at))
      return catchError(errMessages.emptyFileds, "bad", res)

    if (err instanceof multer.MulterError) {
      return catchError(errMessages.uploadFailed, "error", res, err)
    } else if (err) {
      return catchError(errMessages.sysErrorWhenUploading, "error", res, err)
    }
    // Everything went fine with multer and uploading
    if (!req.uploaded_photo)
      return catchError(errMessages.issuesSavingPhoto, "error", res)

    try {
      const created_at = moment(new Date())

      await db("center_certs").insert({
        center_id: center_initial.id,
        name,
        type,
        expires_at,
        photo: req.uploaded_photo,
        created_by: user_id,
        created_at,
      })

      return res.status(status.success).send(successMessage)
    } catch (error) {
      return catchError(errMessages.operationFailed, "error", res, error)
    }
  })
}

module.exports = { addCerts }
