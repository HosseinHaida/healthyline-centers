const db = require("../../db").Instance()
// var fs = require("fs")
const moment = require("moment")
// const axios = require("axios")
const {
  hashString,
  isShortPassword,
  containsPersian,
  isEmpty,
  generateUserToken,
  comparePassword,
  doArraysContainTheSame,
  isValidEmail,
  isAllPersian,
} = require("../helpers/validations")
const { catchError } = require("../tools/catchError")

const { successMessage, status, error } = require("../helpers/status")
// const { upload } = require("./usersPhotoUpload")
// const multer = require("multer")
const { errMessages } = require("../helpers/errMessages")

const { fetchThisUser } = require("../helpers/db")
// const { p2e } = require("../helpers/strings")

const signup = async (req, res) => {
  const { email, password, password_confirm } = req.body
  // Check if email is valid
  if (!isValidEmail(email)) {
    error.message = "notValidEmail"
    return catchError(errMessages.notValidEmail, "bad", res, error)
  }

  if (password !== password_confirm) {
    error.message = "passDonotMatch"
    return catchError(errMessages.passDonotMatch, "bad", res, error)
  }

  // Insertion created_at
  const created_at = moment(new Date())

  // Check if emtpy fields
  if (isEmpty(email) || isEmpty(password)) {
    error.message = "emptyFields"
    return catchError(errMessages.emptyFileds, "bad", res, error)
  }

  // Check if there are Persian characters
  if (containsPersian(password)) {
    error.message = "persianDetected"
    return catchError(errMessages.noPersianPlease, "bad", res, error)
  }

  // Check if password is short
  if (!isShortPassword(password)) {
    error.message = "shortPassword"
    return catchError(errMessages.shortPassword, "bad", res, error)
  }

  const password_hash = hashString(password)
  const userPayload = {
    email,
    password_hash,
    created_at,
  }
  try {
    // Insert user to DB
    const r = await db("users").insert(userPayload)
    // Select the same user from DB
    const thisUser = await db
      .select("id", "email", "agreed")
      .from({ u: "users" })
      .where("u.email", userPayload.email)
      .first()
    // Generate token for the user
    const token = generateUserToken(thisUser.id, thisUser.email)

    // Create user obj with token && send to client
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
    error.message = "noInput"
    return catchError(errMessages.noInput, "bad", res, error)
  }

  try {
    // Find user in DB
    const thisUser = await fetchThisUser(username)

    // If user email not found
    if (!thisUser) {
      error.message = "userNotFound"
      return catchError(errMessages.userNotFound, "notfound", res, error)
    }

    // Check if is account is connected to google
    if (thisUser.is_g_auth && isEmpty(thisUser.password_hash)) {
      error.message = "signinWithGoogle"
      return catchError(errMessages.signinWithGoogle, "bad", res, error)
    }

    // Check if the right password
    if (!comparePassword(thisUser.password_hash, password)) {
      error.message = "wrongPass"
      return catchError(errMessages.wrongPass, "bad", res, error)
    }
    // Generate token for user
    const token = generateUserToken(thisUser.id, thisUser.email)
    delete thisUser.password_hash
    // Create user obj with token && send to client
    successMessage.user = thisUser
    successMessage.user.token = token
    return res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

const fetchUser = async (req, res) => {
  const { email } = req.user
  try {
    // Find user in DB
    const thisUser = await fetchThisUser(email)
    // Check if no one was found
    if (!thisUser) {
      error.message = "userNotFound"
      return catchError(errMessages.userNotFound, "notfound", res, error)
    }
    delete thisUser.password_hash
    // Create user obj with token && send to client
    successMessage.user = thisUser
    return res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

const updateUser = async (req, res) => {
  const { user_id, email } = req.user
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

  const updateQuery = db("users").where({ email })

  let thisUser
  if (!isEmpty(data.new_pass) || !isEmpty(data.username)) {
    try {
      thisUser = await db
        .select("password_hash", "username")
        .from({ u: "users" })
        .where("u.email", email)
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
    const user = await fetchThisUser(email)
    // Generate token for user
    const token = generateUserToken(user.id, user.email)
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
  const { user_id, email } = req.user
  const { username } = req.params

  if (!username) {
    error.message = "pleaseInsertUsername"
    return catchError(errMessages.pleaseInsertUsername, "bad", res, error)
  }

  try {
    // See if i can find a user with the requested username
    const userWithThisUsername = await fetchThisUser(username)

    successMessage.exists =
      userWithThisUsername && userWithThisUsername.email ? true : false
    return res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

const agreeOnTerms = async (req, res) => {
  const { user_id, email } = req.user
  const { version } = req.body

  try {
    await db("users").where({ email }).update({ agreed: true })
    const thisUser = await fetchThisUser(email)

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
