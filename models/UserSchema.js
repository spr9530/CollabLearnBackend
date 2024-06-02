const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userInfoSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true 
    }
)

const UserInfo = mongoose.model('UserInfo', userInfoSchema)

module.exports = UserInfo