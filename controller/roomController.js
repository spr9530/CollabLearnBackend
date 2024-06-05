const RoomInfo = require('../models/RoomSchema');
const UserInfo = require('../models/UserSchema')

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

const creatRoom = async (req, res) => {
    const data = req.body;
    if (data) {
        try {
            const roomCode = data.roomCode;
            const roomName = data.roomName;
            const userId = req.user.userId;

            const newRoom = new RoomInfo({
                roomCode,
                roomName,
                users: [{
                    userId,
                    role: 'Admin'
                }],
            })

            await newRoom.save();
            res.json({ roomInfo: newRoom })
        } catch (error) {
            res.json({ error: error })
        }
    } else {
        res.send('Data doesnt received')
    }
}

const getRoomData = async (req, res) => {
    const { id: roomId } = req.params;
    if (roomId) {
        try {
            const response = await RoomInfo.findOne({ roomCode: roomId })

            if (response) {
                res.json({ roomInfo: response });
            } else {
                res.status(404).json({ error: 'Room not found' });
            }

        } catch (error) {
            res.send(error)
        }
    }
    else {
        res.send('room Id not found')
    }
}

const addUserToRoom = async (req, res) => {
    const { id } = req.params; 
    const { users } = req.body; 

    try {
        
        const response = await RoomInfo.findOneAndUpdate(
            { roomCode: id }, 
            { $set: { users: users } }, 
            { new: true } 
        );

        console.log(response); 
        res.json({ response }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the room users.' }); // Respond with a generic error message
    }
}


module.exports = { saveRoomData, creatRoom, getRoomData, addUserToRoom };
