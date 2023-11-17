const mongoose = require('mongoose')

const deleteddoctorinfoSchema = new mongoose.Schema({
    doctorid: {
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
    degree: {
        type: String,
        default: ''
    },
    college: {
        type: String,
        default: ''
    },
    clinic: {
        type: String,
        default: ''
    },
    clinicContact: {
        type: String,
        default: ''
    },
    experience: {
        type: Number,
        default: 1
    },
    active: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('deleteddoctorinfo', deleteddoctorinfoSchema);