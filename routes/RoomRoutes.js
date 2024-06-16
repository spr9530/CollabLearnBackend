const express = require('express');
const { saveRoomData, creatRoom, getRoomData, addUserToRoom, updateEditors, createRoomData, getRoomFiles, fetchRoomEditor } = require('../controller/roomController');
const validateUserInfo = require('../controller/validateUser');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "hello" });
});

router.post('/saveData', saveRoomData);
router.post('/createRoom', validateUserInfo, creatRoom)
router.post('/createData/:id', createRoomData) //validate userRoom check
router.get('/getRoomData/:id', getRoomFiles)
router.get('/getRoomEditor/:id', fetchRoomEditor)
router.post('/updateRoomEditors/:id', updateEditors)
router.get('/:id', getRoomData)
router.patch('/:id', addUserToRoom)


module.exports = router;
