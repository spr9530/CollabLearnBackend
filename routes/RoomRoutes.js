const express = require('express');
const { saveRoomData } = require('../controller/roomController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "hello" });
});

router.post('/saveData', saveRoomData);

module.exports = router;
