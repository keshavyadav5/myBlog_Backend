const express = require('express')
const {createComment, getComment, likeComment, editComment, deleteComment, getAllComments} = require('../controller/comment.controller')
const verifyToken = require('../utils/verifyUser');
const router = express.Router()

router.post('/create',verifyToken,createComment)
router.get('/getcomment/:postId',getComment)
router.put('/likeComment/:commentId',verifyToken,likeComment)
router.put('/editComment/:commentId',verifyToken,editComment)
router.delete('/deleteComment/:commentId',verifyToken,deleteComment)
router.get('/getAllComment',verifyToken,getAllComments)

module.exports = router