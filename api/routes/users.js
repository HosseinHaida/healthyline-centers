const express = require("express")

const {
  signup,
  signin,
  fetchUser,
  updateUser,
  checkUsernameDuplicate,
  agreeOnTerms,
} = require("../src/components/users.js")

const verifyAuth = require("../src/middlewares/verifyAuth.js")

const router = express.Router()

// GET
router.get("/fetch", verifyAuth, fetchUser)
router.get("/check/:username?", verifyAuth, checkUsernameDuplicate)

// POST
router.post("/signup", signup)
router.post("/signin", signin)
router.post("/agree/on/terms", verifyAuth, agreeOnTerms)

// PUT
router.put("/update", verifyAuth, updateUser)

module.exports = router
