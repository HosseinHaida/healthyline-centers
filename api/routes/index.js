const express = require("express")

const verifyAuth = require("../src/middlewares/verifyAuth.js")

const { fetchProgress } = require("../src/components/index.js")

const router = express.Router()

// POST
router.get("/progress", verifyAuth, fetchProgress)

module.exports = router
