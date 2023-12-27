const multer = require("multer")
var fs = require("fs")

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    const userCentersFolder = process.env.UPLOAD_DIR_CENTERS + req.user.user_id

    // Create folder for user center if not existant
    if (!fs.existsSync(userCentersFolder)) fs.mkdirSync(userCentersFolder)
    cb(null, userCentersFolder)
  },
  filename: function (req, file, cb) {
    const fileNameSplitted = file.originalname.split(".")
    const fileFormat = fileNameSplitted[fileNameSplitted.length - 1]

    const finalFileName = `${req.upload_params.prefix}_${Math.floor(
      Math.random() * 10000000000
    )}.${fileFormat}`

    cb(null, finalFileName)
    req["uploaded_" + file.fieldname] = finalFileName
  },
})

const upload = (req, res, next) => {
  const onMulterUpload = multer({
    storage: storage,
  }).fields(req.upload_params.fields)

  onMulterUpload(req, res, next)
}

module.exports = { upload }
