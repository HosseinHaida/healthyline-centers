const express = require("express")

const { addCerts } = require("../../src/components/centers/certs.js")

const verifyAuth = require("../../src/middlewares/verifyAuth.js")
const addUploadParams = require("../../src/middlewares/addCertsUploadParams.js")

const router = express.Router()

// POST
router.post("/new", verifyAuth, addUploadParams, addCerts)

module.exports = router
