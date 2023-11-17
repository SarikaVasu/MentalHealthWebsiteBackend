const mongoose = require('mongoose')

const userinfoSchema = new mongoose.Schema({
    userid: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    anonymousname: {
        type: String
        //send 
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    dob: {
        type: String,
        default: ''
    },
    contactno: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('userinfo', userinfoSchema);