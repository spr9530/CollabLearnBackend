const express = require('express');
const { saveRoomData, creatRoom, getRoomData, addUserToRoom } = require('../controller/roomController');
const validateUserInfo = require('../controller/validateUser');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "hello" });
});

router.post('/saveData', saveRoomData);
router.post('/createRoom',validateUserInfo, creatRoom)
router.get('/:id',getRoomData)
router.patch('/:id',addUserToRoom)


module.exports = router;
