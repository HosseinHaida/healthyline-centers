const express = require("express")

const { addSpecialist } = require("../../src/components/centers/specialists.js")

const verifyAuth = require("../../src/middlewares/verifyAuth.js")
const addUploadParams = require("../../src/middlewares/addSpecialistsUploadParams.js")

const router = express.Router()

// POST
router.post("/new", verifyAuth, addUploadParams, addSpecialist)

module.exports = router
