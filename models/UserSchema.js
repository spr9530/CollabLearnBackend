const mongoose = require('mongoose')
const RoomInfo = require('./RoomSchema')
const Schema = mongoose.Schema

const userInfoSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RoomInfo'
        },
    ]
})

const UserInfo = mongoose.model('UserInfo', userInfoSchema)

module.exports = UserInfo