const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

const hashString = (password) => bcrypt.hashSync(password, salt)

const comparePassword = (hashedPassword, password) => {
  return bcrypt.compareSync(password, hashedPassword)
}

const isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/
  return regEx.test(email)
}

const isValidPhone = (phone) => {
  const regEx = new RegExp("^(\\+98|0)?9\\d{9}$")
  return regEx.test(phone)
}

const isShortPassword = (password) => {
  if (password.length <= 7 || password === "") {
    return false
  }
  return true
}

const containsPersian = (s) => {
  let arrayOfWordsSeparatedWithSpaces = s.split(" ")
  var p = /[\u0600-\u06FF\s]/

  let hasPersian = false
  arrayOfWordsSeparatedWithSpaces.forEach((loopS) => {
    if (p.test(loopS)) hasPersian = true
  })
  return hasPersian
}

const isAllPersian = (s) => {
  var p = /^[\u0600-\u06FF\‌\u0028\u0029\s]+$/
  if (String(s).match(p)) return true
  else return false
}

const isEmpty = (input) => {
  if (
    input === undefined ||
    input === "" ||
    input === null ||
    input === "null" ||
    input.length === 0
  ) {
    return true
  } else {
    return false
  }
}

const doArraysContainTheSame = (arrayOne, arrayTwo) =>
  arrayOne.sort().join(",") === arrayTwo.sort().join(",")

const generateUserToken = (id, username) => {
  const token = jwt.sign(
    {
      user_id: id,
      username,
    },
    process.env.SECRET,
    { expiresIn: "14d" }
  )
  return token
}

module.exports = {
  hashString,
  comparePassword,
  isValidEmail,
  isValidPhone,
  isShortPassword,
  containsPersian,
  isAllPersian,
  isEmpty,
  generateUserToken,
  doArraysContainTheSame,
}
