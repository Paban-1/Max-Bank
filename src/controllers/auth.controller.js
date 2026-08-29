const userModel = require("../models/user.model")
const jwt = require('jsonwebtoken')
const eamilService = require("../services/email.service")
const tokenBlackListModel = require("../models/blackList.model")

/**
 * - user Register controller
 * - POST /api/auth/register 
 */
async function userRegisterConntroller(req, res) {
    const { email, password, name } = req.body

    // Find and Check if user exists 
    const isExists = await userModel.findOne({
        email: email
    })

    if (isExists) {
        return res.status(422).json({
            message: 'User already exists with email.',
            status: "failed"
        })
    }

    // Create user
    const user = await userModel.create({
        email, password, name
    })


    // create tokan for stay login user
    const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    // set token to the cookies
    res.cookie("jwt_token", token)
    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        }
    })

    await eamilService.sendRegistartionEmail(user.email, user.name)
}

/**
 * - user Login controller
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email }).select('+password')

    if (!user) {
        return res.status(401).json({
            message: 'Email or password is incorrect'
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or Password is incorrect"
        })
    }

    // create tokan for stay login user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    // set token to the cookies
    res.cookie("token", token)
    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        }
    })
}

/**
 * - User logout Controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(200).json({
            message: "User is logged out",
        })
    }

    
    await tokenBlackListModel.create({
        token: token
    })
    
    res.clearCookie("token")

    res.status(200).json({
        message: "User is logged out Successfully",
    })
}

module.exports = {
    userRegisterConntroller,
    userLoginController,
    userLogoutController
}