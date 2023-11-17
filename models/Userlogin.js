const mongoose = require('mongoose')

const userloginSchema = new mongoose.Schema({
    userid: {
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
    // remove access
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('userlogin', userloginSchema);