const { errorMessage, status } = require("../helpers/status.js")
const { errMessages } = require("../helpers/errMessages.js")
const { checkIfAdmin } = require("../helpers/db.js")
const { catchError } = require("../tools/catchError.js")

const verifyAdmin = async (req, res, next) => {
  const { user_id } = req.user
  if (!user_id) {
    errorMessage.error = errMessages.notAuthorized
    return res.status(status.bad).send(errorMessage)
  }
  try {
    const isAdmin = await checkIfAdmin(user_id, res)
    if (!isAdmin) return catchError(errMessages.notAuthorized, "bad", res)
    next()
  } catch (error) {
    errorMessage.error = errMessages.authFailed
    return res.status(status.unauthorized).send(errorMessage)
  }
}

module.exports = verifyAdmin
