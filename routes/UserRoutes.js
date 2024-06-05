const express = require('express');
const { checkUser, adduser, userLoggin, getUserInfo, updateUserInfo } = require('../controller/userController');
const validateUserInfo = require('../controller/validateUser');

const router = express.Router();

router.post('/checkUser', checkUser)
router.post('/logginUser', userLoggin)
router.post('/addUser', adduser)
router.patch('/updateUser', validateUserInfo, updateUserInfo)
router.post('/getUserInfo', validateUserInfo, getUserInfo)

module.exports = router;