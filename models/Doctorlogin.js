const mongoose = require('mongoose')

const doctorloginSchema = new mongoose.Schema({
    doctorid: {
        type: Number,
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
    
    // remove access by admin only
    active: {
        type: Boolean,
        default: true
    }
    // refreshToken: String
})

module.exports = mongoose.model('doctorlogin', doctorloginSchema);