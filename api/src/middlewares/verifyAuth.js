const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const { errorMessage, status } = require("../helpers/status.js")
const { errMessages } = require("../helpers/errMessages.js")

dotenv.config()

const verifyToken = async (req, res, next) => {
  const { token } = req.headers
  if (!token) {
    errorMessage.error = errMessages.tokenNotFound
    return res.status(status.bad).send(errorMessage)
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
    }
    next()
  } catch (error) {
    errorMessage.error = errMessages.authFailed
    return res.status(status.unauthorized).send(errorMessage)
  }
}

module.exports = verifyToken
