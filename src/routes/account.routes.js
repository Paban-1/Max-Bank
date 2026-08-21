const express = require('express')
const authMiddleware = require("../middlewares/auth.middleware")


const router = express.Router()

/**
 * - POST /api/accounts/
 * - Create a New Account
 * - Protected Route
 */
router.post("/", authMiddleware.authMiddleware)


module.exports = router