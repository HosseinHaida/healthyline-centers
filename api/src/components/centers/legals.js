const db = require(".././../../db").Instance()
const moment = require("moment")
const multer = require("multer")
const { catchError } = require("../../tools/catchError")
const fs = require("fs")
const {
  isEmpty,
  isAllPersian,
  isValidPhone,
} = require("../../helpers/validations")
const { upload } = require("./upload.js")
const { successMessage, status } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")
const { checkIfAdmin } = require("../../helpers/db.js")
const { blobType } = require("../../helpers/blobTypes.js")

const addLegals = async (req, res) => {
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
      phone,
    } = req.body

    if (
      isEmpty(first_name) ||
      isEmpty(last_name) ||
      isEmpty(gender) ||
      isEmpty(rank) ||
      isEmpty(phone)
    )
      return catchError(errMessages.emptyFileds, "bad", res)

    if (!isValidPhone(phone))
      return catchError(errMessages.notValidPhone, "bad", res)

    if (!isAllPersian(first_name) || !isAllPersian(last_name))
      return catchError(errMessages.onlyPersianForName, "bad", res)

    if (err instanceof multer.MulterError) {
      return catchError(errMessages.uploadFailed, "error", res, err)
    } else if (err) {
      return catchError(errMessages.sysErrorWhenUploading, "error", res, err)
    }
    // Everything went fine with multer and uploading
    if (!req.uploaded_photo || !req.uploaded_certPhoto)
      return catchError(errMessages.issuesSavingPhoto, "error", res)

    try {
      const created_at = moment(new Date())

      await db("center_legals").insert({
        center_id: center_initial.id,
        first_name,
        last_name,
        rank,
        gender,
        phone,
        photo: req.uploaded_photo,
        cert_photo: req.uploaded_certPhoto,
        created_by: user_id,
        created_at,
      })

      return res.status(status.success).send()
    } catch (error) {
      return catchError(errMessages.operationFailed, "error", res, error)
    }
  })
}

const fetchList = async (req, res) => {
  const { user_id } = req.user

  try {
    const list = await db("center_legals")
      .select(
        "first_name as firstName",
        "last_name as lastName",
        "id",
        "rank",
        "gender",
        "phone",
        "created_at",
        "created_by",
        "center_id"
      )
      .where({ created_by: user_id })

    successMessage.list = list
    res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

const fetchItem = async (req, res) => {
  const { user_id } = req.user
  const { id } = req.params

  try {
    const item = await db("center_legals")
      .select(
        "first_name as firstName",
        "last_name as lastName",
        "id",
        "rank",
        "gender",
        "phone",
        "photo",
        "cert_photo as certPhoto",
        "created_at",
        "created_by",
        "center_id"
      )
      .where({ id })
      .first()

    const isAdmin = await checkIfAdmin(user_id, res)
    if (!isAdmin && item.created_by !== user_id)
      return catchError(errMessages.notAuthorized, "bad", res, error)

    const pathToPhoto = `${process.env.UPLOAD_DIR_CENTERS}${user_id}/${item.photo}`
    const pathToCertPhoto = `${process.env.UPLOAD_DIR_CENTERS}${user_id}/${item.certPhoto}`

    const photo = fs.readFileSync(pathToPhoto)
    const certPhoto = fs.readFileSync(pathToCertPhoto)

    successMessage.item = {
      ...item,
      photoBase64: Buffer.from(photo).toString("base64"),
      photoType:
        blobType[item.photo.substring(item.photo.lastIndexOf(".") + 1)],
      certPhotoBase64: Buffer.from(certPhoto).toString("base64"),
      certPhotoType:
        blobType[item.certPhoto.substring(item.certPhoto.lastIndexOf(".") + 1)],
    }

    res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = { addLegals, fetchList, fetchItem }
