const express = require('express')
const { SignUp, SignIn, google } = require('../controller/auth.controller')
const router = express.Router()

router.post('/signup',SignUp)
router.post('/signin',SignIn)
router.post('/google',google)

module.exports = router