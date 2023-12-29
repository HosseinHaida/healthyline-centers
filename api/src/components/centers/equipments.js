const db = require(".././../../db").Instance()
const moment = require("moment")
const multer = require("multer")
const { catchError } = require("../../tools/catchError")

const { isEmpty } = require("../../helpers/validations")
const { upload } = require("./upload.js")
const { successMessage, status, error } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")

const addEquipment = async (req, res) => {
  const { user_id } = req.user

  let center_initial
  try {
    center_initial = await db("center_initials")
      .select("id", "created_by")
      .where({ created_by: user_id })
      .first()

    if (!center_initial)
      return catchError(errMessages.noCentersInitialized, "bad", res)
  } catch (error) {
    return catchError(errMessages.failedFetchingCenter, "error", res, error)
  }

  // Upload the photos to ../upload/centers/[user_id]/legals
  upload(req, res, async (err) => {
    const { name, brand, usage } = req.body

    if (isEmpty(name) || isEmpty(brand) || isEmpty(usage))
      return catchError(errMessages.emptyFileds, "bad", res)

    if (err instanceof multer.MulterError) {
      return catchError(errMessages.uploadFailed, "error", res, err)
    } else if (err) {
      return catchError(errMessages.sysErrorWhenUploading, "error", res, err)
    }
    // Everything went fine with multer and uploading
    if (!req.uploaded_photo || !req.uploaded_catalog)
      return catchError(errMessages.issuesSavingPhoto, "error", res)

    try {
      const created_at = moment(new Date())

      await db("center_equipments").insert({
        center_id: center_initial.id,
        name,
        brand,
        usage,
        photo: req.uploaded_photo,
        catalog: req.uploaded_catalog,
        created_by: user_id,
        created_at,
      })

      return res.status(status.success).send(successMessage)
    } catch (error) {
      return catchError(errMessages.operationFailed, "error", res, error)
    }
  })
}

module.exports = { addEquipment }
