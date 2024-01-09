const express = require("express")
const verifyAuth = require("../src/middlewares/verifyAuth.js")

const addUploadParamsEquips = require("../src/middlewares/addEquipmentsUploadParams.js")
const addUploadParamsLegals = require("../src/middlewares/addLegalsUploadParams.js")
const addUploadParamsCerts = require("../src/middlewares/addCertsUploadParams.js")
const addUploadParamsSpecs = require("../src/middlewares/addSpecialistsUploadParams.js")

// Handlers
const {
  fetchCenter,
  addCenter,
} = require("../src/components/centers/initials.js")
const {
  fetchList,
  fetchItem,
  addLegals,
} = require("../src/components/centers/legals.js")
const { addCerts } = require("../src/components/centers/certs.js")
const { addEquipment } = require("../src/components/centers/equipments.js")
const { addSpecialist } = require("../src/components/centers/specialists.js")
const {
  fetchOrgs,
  addOrg,
} = require("../src/components/centers/organizations.js")

const router = express.Router()

// GET
router.get("/initials", verifyAuth, fetchCenter)
router.get("/legals", verifyAuth, fetchList)
router.get("/legals/:id", verifyAuth, fetchItem)
router.get("/orgs/list", verifyAuth, fetchOrgs)

// POST
router.post("/initials/new", verifyAuth, addCenter)
router.post("/legals/new", verifyAuth, addUploadParamsLegals, addLegals)
router.post("/certs/new", verifyAuth, addUploadParamsCerts, addCerts)
router.post("/equipments/new", verifyAuth, addUploadParamsEquips, addEquipment)
router.post("/specialists/new", verifyAuth, addUploadParamsSpecs, addSpecialist)
router.post("/orgs/new", verifyAuth, addOrg)

module.exports = router
