const express = require('express')
const { test, updateUser, deleteUser, signout, getUser, getCommentUser } = require('../controller/user.controller')
const verifyToken = require('../utils/verifyUser')
const router = express.Router()

router.post('/test',test)
router.put('/update/:userId',verifyToken,updateUser);
router.delete('/delete/:userId',verifyToken,deleteUser)
router.post('/signout',signout)
router.get('/getusers',verifyToken,getUser)
router.get('/:userId',getCommentUser)

module.exports = router
  