const mongoose = require('mongoose')

const deletedloginSchema = new mongoose.Schema({
    assignedId: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    anonymousname: {
        type: String
        //send 
    },
    roles: {
        type: [String],
        default: ["User"]
    },
    // array allows u multiple users
    // roles: {
    //     type: String,
    //     default: "user"
    // },
    // remove access
    active: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('deletedlogin', deletedloginSchema);