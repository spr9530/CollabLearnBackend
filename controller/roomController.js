const EditorInfo = require('../models/EditorsSchema');
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
    const { id } = req.params;
    if (id) {
        console.log(id)
        try {
            const response = await RoomInfo.findOne({ _id: id })
            await RoomInfo.populate(response,{
                path:'users.userId'
            })

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

        res.json({ response }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the room users.' }); // Respond with a generic error message
    }
}

const createRoomData = async(req,res) => {
    const {name, type} = req.body
    const {id} = req.params
    console.log(req.body)
    if(!name || !type ){
        res.status(501).json({error: 'Data is not Provided'})
    }

    try{
        const data = new EditorInfo({
            editorType: type,
            editorName: name,
            roomId:id,
            roomData:''
        })
    
        await data.save();
        res.status(200).json({success: 'file Created Successfully'})
    }catch(error){
        res.status(500).json({error})
    }
}

const getRoomFiles = async(req,res) =>{
    const { id } = req.params;

try {
    const fetchRoomFiles = await EditorInfo.find({ roomId: id });
    if(!fetchRoomFiles){
        return res.status(404).json({ error: 'Room files not found' });
    }
    if (fetchRoomFiles.length === 0) {
        return res.json({ error: 'No Files Created' });
    }

    res.json(fetchRoomFiles);
} catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
}

}

const updateEditors = async(req,res) =>{
    const {roomData} = req.body
    const {id} = req.params;
    console.log(req.body)
    try{
        if(!roomData && roomData!=''){
            res.status(501).json({error:'Data not Provided'})
        }
    
        const editor = await EditorInfo.findOneAndUpdate({_id: id}, {$set :{roomData: roomData }}, {new:true})
        res.json({ editor }); 
    
    }catch(error){
        res.status(501).json({error: error.message})
    }

}

const fetchRoomEditor = async(req, res) => {
    const {id} = req.params;

    try{

        const response = await EditorInfo.findOne({_id: id})

        res.json({response})

    }catch(error){
        res.status(501).json({error: error.message})
    }
}


module.exports = { saveRoomData, creatRoom, getRoomData, addUserToRoom, updateEditors, createRoomData, getRoomFiles,fetchRoomEditor };
