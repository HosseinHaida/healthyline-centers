const { status } = require("../helpers/status")

const addUploadParams = async (req, res, next) => {
  try {
    req.upload_params = {
      prefix: "equipments",
      fields: [
        { name: "photo", maxCount: 1 },
        { name: "catalog", maxCount: 1 },
      ],
    }
    next()
  } catch (error) {
    errorMessage.error = errMessages.addUploadParamsFailed
    return res.status(status.error).send(errorMessage)
  }
}

module.exports = addUploadParams
