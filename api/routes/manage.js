const express = require("express")

const verifyAuth = require("../src/middlewares/verifyAuth.js")
const verifyAdmin = require("../src/middlewares/verifyAdmin.js")

const { fetchCenters } = require("../src/components/manage/manageCenters.js")
const {
  fetchOrgs,
  updateOrgStatus,
} = require("../src/components/manage/manageOrgs.js")

const router = express.Router()

// GET
router.get("/centers/list", verifyAuth, verifyAdmin, fetchCenters)
router.get("/orgs/list/:org_status?", verifyAuth, verifyAdmin, fetchOrgs)
router.post("/orgs/status/update", verifyAuth, verifyAdmin, updateOrgStatus)

module.exports = router
