const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomSchema = new Schema(({
    roomCode:{
        type:String,
        required: true,
    },
    user:[
        {
           userId:{
            type: String,
           },
           userRole:{
            type:String,
           }
        },
    ],
    roomInfo:[
        {
           textEditor:{
            type: String,
           },
           whiteBoard:{
            type:String,
           }
        },
    ]
    
}))

const RoomInfo = mongoose.model('RoomInfo', RoomSchema);

module.exports = RoomInfo;