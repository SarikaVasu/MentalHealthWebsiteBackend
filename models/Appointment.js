const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    doctorid: {
        type: String,
        required: true
    },
    doctorname: {
        type: String,
        required: true
    },
    patientname: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('appointment', appointmentSchema);