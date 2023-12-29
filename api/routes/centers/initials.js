const express = require("express")

const {
  addCenter,
  fetchCenter,
} = require("../../src/components/centers/initials.js")

const verifyAuth = require("../../src/middlewares/verifyAuth.js")

const router = express.Router()

// GET
router.get("/", verifyAuth, fetchCenter)

// POST
router.post("/new", verifyAuth, addCenter)

module.exports = router
