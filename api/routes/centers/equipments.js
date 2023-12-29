const express = require("express")

const { addEquipment } = require("../../src/components/centers/equipments.js")

const verifyAuth = require("../../src/middlewares/verifyAuth.js")
const addUploadParams = require("../../src/middlewares/addEquipmentsUploadParams.js")

const router = express.Router()

// POST
router.post("/new", verifyAuth, addUploadParams, addEquipment)

module.exports = router
