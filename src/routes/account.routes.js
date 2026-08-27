const express = require('express')
const authMiddleware = require("../middlewares/auth.middleware")
const accountController = require("../controllers/account.controller")

const router = express.Router()

/**
 * - POST /api/accounts/
 * - Create a New Account
 * - Protected Route
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController)


/**
 * - GET /api/accounts/
 * - GET all accounts of the logged-in user
 * - Protected Route
 */
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountController)


module.exports = router