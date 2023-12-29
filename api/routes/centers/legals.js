const express = require("express")

const {
  addLegals,
  fetchList,
  fetchItem,
} = require("../../src/components/centers/legals.js")

const verifyAuth = require("../../src/middlewares/verifyAuth.js")
const addUploadParams = require("../../src/middlewares/addLegalsUploadParams.js")

const router = express.Router()

// GET
router.get("/", verifyAuth, fetchList)
router.get("/:id", verifyAuth, fetchItem)

// POST
router.post("/new", verifyAuth, addUploadParams, addLegals)

module.exports = router
