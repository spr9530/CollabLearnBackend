const mongoose = require('mongoose');

const Schema = mongoose.Schema

const editorSchema = new Schema({
    editorType:{
        type:String,
        required: true,
    },
    editorName:{
        type:String,
        required: true,
    },
    roomId:{
        type:String,
        required: true,
    },
    roomData:{
        type:String,
    }
})

const EditorInfo = mongoose.model('EditorInfo', editorSchema)

module.exports = EditorInfo