const express = require("express")

const { addLegals } = require("../../src/components/centers/legals.js")

const verifyAuth = require("../../src/middlewares/verifyAuth.js")
const addUploadParams = require("../../src/middlewares/addLegalsUploadParams.js")

const router = express.Router()

// POST
router.post("/new", verifyAuth, addUploadParams, addLegals)

module.exports = router
