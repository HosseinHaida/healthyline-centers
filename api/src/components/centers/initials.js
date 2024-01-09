const db = require(".././../../db").Instance()
const moment = require("moment")
const { catchError } = require("../../tools/catchError")

const {
  isEmpty,
  isValidPhone,
  hashString,
} = require("../../helpers/validations")
const { successMessage, status } = require("../../helpers/status")
const { errMessages } = require("../../helpers/errMessages")
const { checkIfAdmin } = require("../../helpers/db")

const addCenter = async (req, res) => {
  const { user_id } = req.user
  const {
    registrationName: registration_name,
    brandName: brand_name,
    postalCode: postal_code,
    exactAddress: exact_address,
    phoneEntries: phone,
    website,
    province,
    city,
    gis,
    loginFirstName: login_first_name,
    loginLastName: login_last_name,
    loginGender: login_gender,
    loginPhone: login_phone,
  } = req.body

  try {
    const isAdmin = await checkIfAdmin(user_id, res)

    const center_initial = await db("centers")
      .select("id", "created_by")
      .where({ created_by: user_id })
      .first()

    if (center_initial && !isAdmin)
      return catchError(errMessages.alreadyAddedACenter, "bad", res)

    let fieldsToCheck = [registration_name, province, city]
    fieldsToCheck = isAdmin
      ? fieldsToCheck.concat([
          login_first_name,
          login_last_name,
          login_gender,
          login_phone,
        ])
      : fieldsToCheck.concat([
          brand_name,
          gis,
          postal_code,
          exact_address,
          phone,
        ])

    fieldsToCheck.forEach((field) => {
      if (isEmpty(field)) return catchError(errMessages.emptyFileds, "bad", res)
    })

    if (isAdmin && !isValidPhone(login_phone))
      return catchError(errMessages.notValidPhone, "bad", res)

    const created_at = moment(new Date())
    const representative_code = `${user_id}-${Math.floor(
      Math.random() * 100000
    )}`

    await db
      .transaction(async function (trx) {
        await db("centers")
          .transacting(trx)
          .insert(
            {
              registration_name,
              brand_name,
              gis: gis ? `${gis[0]},${gis[1]}` : "",
              postal_code,
              exact_address,
              phone,
              website,
              province,
              city,
              representative_code,
              created_by: user_id,
              created_at,
            },
            "id" // return row id after pending insert
          )
          .then(async (resp) => {
            if (!isAdmin) return true
            return await db("users")
              .transacting(trx)
              .insert({
                phone: login_phone,
                first_name: login_first_name,
                last_name: login_last_name,
                created_by: user_id,
                created_at,
                password_hash: hashString("googlegoogle"),
                // Is now recognised as a Center login
                is_center_auth: true,
                center_id: resp[0].id,
              })
          })
          .then(trx.commit)
          .catch(trx.rollback)
      })
      .then(
        (resp) => resp // Transaction Complete
      )
      .catch(function (err) {
        if (err.routine && err.routine === "_bt_check_unique") {
          return catchError(errMessages.phoneDuplicate, "conflict", res, err)
        }
        return catchError(errMessages.transactionFailed, "error", res, err)
      })

    return res.status(status.success).send()
  } catch (error) {
    console.log(error)
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

const fetchCenter = async (req, res) => {
  const { user_id } = req.user

  try {
    const center = await db("centers")
      .select("*")
      .where({ created_by: user_id })
      .first()

    if (!center) return res.status(status.success).send()

    const centerFormal = {
      ...center,
      registrationName: center.registration_name,
      brandName: center.brand_name,
      postalCode: center.postal_code,
      exactAddress: center.exact_address,
      gis: center.gis.split(","),
      phoneEntries: center.phone,
    }

    successMessage.center = centerFormal
    res.status(status.success).send(successMessage)
  } catch (error) {
    return catchError(errMessages.operationFailed, "error", res, error)
  }
}

module.exports = { addCenter, fetchCenter }
