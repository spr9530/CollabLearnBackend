const RoomInfo = require('../models/RoomSchema');

const saveRoomData = async (req, res) => {
    const data = req.body;
    if (data) {
        try {
            const response = new RoomInfo(data);
            await response.save();
            console.log(response);
            res.status(201).json({ message: "Room data saved successfully", data: response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to save room data" });
        }
    } else {
        res.status(400).json({ message: "No data provided" });
    }
};

module.exports = { saveRoomData };
