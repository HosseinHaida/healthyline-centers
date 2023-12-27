const express = require("express")

const { addCenter } = require("../../src/components/centers/initials.js")

const verifyAuth = require("../../src/middlewares/verifyAuth.js")

const router = express.Router()

// POST
router.post("/new", verifyAuth, addCenter)

module.exports = router
