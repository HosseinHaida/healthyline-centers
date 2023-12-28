const db = require("../../db").Instance()
const moment = require("moment")
// const axios = require("axios")
const {
  hashString,
  isShortPassword,
  containsPersian,
  isEmpty,
  generateUserToken,
  comparePassword,
  // doArraysContainTheSame,
  isAllPersian,
  isValidPhone,
} = require("../helpers/validations")
const { catchError } = require("../tools/catchError")

const { successMessage, status, error } = require("../helpers/status")
// const { upload } = require("./usersPhotoUpload")
// const multer = require("multer")
const { errMessages } = require("../helpers/errMessages")

const { fetchThisUser } = require("../helpers/db")
// const { p2e } = require("../helpers/strings")

const signup = async (req, res) => {
  const { phone, password, password_confirm } = req.body

  if (!isValidPhone(phone)) {
    return catchError(errMessages.notValidPhone, "bad", res, error)
  }

  if (password !== password_confirm) {
    return catchError(errMessages.passDonotMatch, "bad", res, error)
  }

  const created_at = moment(new Date())

  if (isEmpty(phone) || isEmpty(password)) {
    return catchError(errMessages.emptyFileds, "bad", res, error)
  }

  if (containsPersian(password)) {
    return catchError(errMessages.noPersianPlease, "bad", res, error)
  }

  if (!isShortPassword(password)) {
    return catchError(errMessages.shortPassword, "bad", res, error)
  }

  const password_hash = hashString(password)
  const userPayload = { phone, password_hash, created_at }
  try {
    const r = await db("users").insert(userPayload)
    // Select the same user from DB
    const thisUser = await db
      .select("id", "phone", "agreed")
      .from({ u: "users" })
      .where("u.phone", userPayload.phone)
      .first()

    const token = generateUserToken(thisUser.id, thisUser.phone)

    successMessage.user = thisUser
    successMessage.user.token = token
    return res.status(status.created).send(successMessage)
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      return catchError(errMessages.usernameExists, "conflict", res, error)
    } else {
      return catchError(errMessages.operationFailed, "error", res, error)
    }
  }
}

const signin = async (req, res) => {
  const { username, password } = req.body

  if (isEmpty(username) || isEmpty(password)) {
    return catchError(errMessages.noInput, "bad", res, error)
  }

  try {
    const thisUser = await fetchThisUser(username)

    if (!thisUser) {
      return catchError(errMessages.userNotFound, "notfound", res, error)
    }

    if (!comparePassword(thisUser.password_hash, password)) {
      return catchError(errMessages.wrongPass, "bad", res, error)
    }

    const token = generateUserToken(thisUser.id, thisUser.phone)
    delete thisUser.password_hash
    successMessage.user = thisUser
    successMessage.user.token = token
    return res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

const fetchUser = async (req, res) => {
  const { username } = req.user
  try {
    const thisUser = await fetchThisUser(username)
    if (!thisUser) {
      return catchError(errMessages.userNotFound, "notfound", res, error)
    }
    delete thisUser.password_hash
    successMessage.user = thisUser
    return res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

const updateUser = async (req, res) => {
  const { user_id, phone } = req.user
  const { data } = req.body

  if (Object.entries(data).length <= 0) {
    error.message = "noChanges"
    return catchError(errMessages.noChanges, "bad", res, error)
  }

  const updated_at = moment(new Date())

  const allowedFields = ["first_name", "last_name", "phone"]

  if (
    (!isEmpty(data.first_name) && !isAllPersian(data.first_name)) ||
    (!isEmpty(data.last_name) && !isAllPersian(data.last_name))
  )
    return catchError(errMessages.onlyPersianForName, "bad", res)

  const columnsToBeUpdated = {}
  Object.entries(data).forEach(([k, v]) => {
    if (allowedFields.indexOf(k) >= 0) columnsToBeUpdated[k] = v
  })

  if (!isEmpty(data.username)) {
    if (containsPersian(data.username))
      return catchError(errMessages.usernameContainsPersian, "bad", res)
    columnsToBeUpdated["username"] = data.username
  }

  if (!isEmpty(data.phone)) {
    let numRegEX = /^[0-9]+$/
    if (
      data.phone.substring(0, 2) !== "09" ||
      data.phone.length < 11 ||
      data.phone.length > 11 ||
      !data.phone.match(numRegEX)
    )
      return catchError(errMessages.phoneShouldBeLike, "bad", res)
  }

  columnsToBeUpdated.updated_at = updated_at

  const updateQuery = db("users").where({ phone })

  let thisUser
  if (!isEmpty(data.new_pass) || !isEmpty(data.username)) {
    try {
      thisUser = await db
        .select("password_hash", "username")
        .from({ u: "users" })
        .where("u.phone", phone)
        .first()
    } catch (error) {
      return catchError(errMessages.couldNotFetchUser, "error", res, error)
    }
  }
  if (!isEmpty(data.new_pass)) {
    // Check if old password is empty
    if (isEmpty(data.old_pass)) {
      error.message = "oldPassMissing"
      return catchError(errMessages.oldPassMissing, "bad", res, error)
    }
    // Check if there are Persian characters
    if (containsPersian(data.new_pass)) {
      error.message = "persianDetected"
      return catchError(errMessages.noPersianPlease, "bad", res, error)
    }
    // Check if passwords are short
    if (!isShortPassword(data.new_pass)) {
      error.message = "shortPassword"
      return catchError(errMessages.shortPassword, "bad", res, error)
    }
    // Check if the right password
    if (!comparePassword(thisUser.password_hash, data.old_pass)) {
      error.message = "incorrectPass"
      return catchError(errMessages.incorrectPass, "bad", res, error)
    }
    columnsToBeUpdated["password_hash"] = hashString(data.new_pass)
  }
  try {
    // Actually do the update query
    await updateQuery.update(columnsToBeUpdated)
    // Fetch the same user after the update
    const user = await fetchThisUser(phone)
    // Generate token for user
    const token = generateUserToken(user.id, user.phone)
    delete user.password_hash
    // Create user obj with token && send to client
    successMessage.user = user
    successMessage.user.token = token
    return res.status(status.success).send(successMessage)
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      return catchError(errMessages.usernameAlreadyExists, "conflict", res)
    } else {
      return catchError(errMessages.operationFailed, "error", res, error)
    }
  }
}

const checkUsernameDuplicate = async (req, res) => {
  const { user_id, phone } = req.user
  const { username } = req.params

  if (!username) {
    error.message = "pleaseInsertUsername"
    return catchError(errMessages.pleaseInsertUsername, "bad", res, error)
  }

  try {
    // See if i can find a user with the requested username
    const userWithThisUsername = await fetchThisUser(username)

    successMessage.exists =
      userWithThisUsername && userWithThisUsername.phone ? true : false
    return res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

const agreeOnTerms = async (req, res) => {
  const { user_id, phone } = req.user
  const { version } = req.body

  try {
    await db("users").where({ phone }).update({ agreed: true })
    const thisUser = await fetchThisUser(phone)

    successMessage.user = thisUser
    return res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = {
  signup,
  signin,
  fetchUser,
  updateUser,
  checkUsernameDuplicate,
  agreeOnTerms,
}
