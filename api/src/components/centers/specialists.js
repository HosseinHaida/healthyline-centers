const db = require(".././../../db").Instance()
const moment = require("moment")
const multer = require("multer")
const { catchError } = require("../../tools/catchError")

const { isEmpty, isAllPersian } = require("../../helpers/validations")
const { upload } = require("./upload.js")
const { successMessage, status, error } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")

const addSpecialist = async (req, res) => {
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

  // Upload the photos to ../upload/centers/[user_id]/legals
  upload(req, res, async (err) => {
    const {
      firstName: first_name,
      lastName: last_name,
      gender,
      rank,
      experience,
    } = req.body

    if (
      isEmpty(first_name) ||
      isEmpty(last_name) ||
      isEmpty(gender) ||
      isEmpty(rank) ||
      isEmpty(experience)
    )
      return catchError(errMessages.emptyFileds, "bad", res)

    if (!isAllPersian(first_name) || !isAllPersian(last_name))
      return catchError(errMessages.onlyPersianForName, "bad", res)

    if (err instanceof multer.MulterError) {
      return catchError(errMessages.uploadFailed, "error", res, err)
    } else if (err) {
      return catchError(errMessages.sysErrorWhenUploading, "error", res, err)
    }
    // Everything went fine with multer and uploading
    if (!req.uploaded_photo || !req.uploaded_resume)
      return catchError(errMessages.issuesSavingPhoto, "error", res)

    try {
      const created_at = moment(new Date())

      await db("center_specialists").insert({
        center_id: center_initial.id,
        first_name,
        last_name,
        rank,
        gender,
        experience,
        photo: req.uploaded_photo,
        resume: req.uploaded_resume,
        created_by: user_id,
        created_at,
      })

      return res.status(status.success).send(successMessage)
    } catch (error) {
      return catchError(errMessages.operationFailed, "error", res, error)
    }
  })
}

module.exports = { addSpecialist }
