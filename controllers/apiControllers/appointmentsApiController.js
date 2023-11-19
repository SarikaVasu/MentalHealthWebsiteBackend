//use in profile update
const Appointment = require('../../models/Appointment');

//Desc for each func

// @desc Get all users
// @route GET /users
// @access Private
const getAllAppinfos = async (req, res) => {
    // Get all users from MongoDB
    // const {id} = req.params;
    const appointments = await Appointment.find().lean();
    // If no users
    if (!appointments?.length) {
        return res.status(400).json({ message: 'No appointments found' });
    }
    res.json(appointments);    
}

const getAppinfoByDateDoctor  = async (req, res) => {
    const { date, doctorid } = req.body;

    // Confirm data 
    if (!date || !doctorid) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate 
    const appointments = await Appointment.find({ appointmentDate: date, doctorid }).lean();

    if (!appointments?.length) {
        return res.status(400).json({ message: 'No appointments found' });
    }

    res.json(appointments);
}

const createAppinfo = async (req, res) => {
    const { userid, doctorid, doctorname, patientname, mode, appointmentDate, bookingDate } = req.body;

    // Confirm data 
    if (!userid || !doctorid || !doctorname || !patientname || !mode || !bookingDate || !appointmentDate ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate 
    const duplicate = await Appointment.findOne({ doctorname, appointmentDate }).collation({ locale: 'en', strength: 2}).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'No slot available for appointment' });
    }

    // Create and store the new user 
    const appointment = await Appointment.create({ userid, doctorid, doctorname, patientname, mode, bookingDate, appointmentDate });

    if (appointment) { // Created 
        return res.status(201).json({ message: `New appointment created` });
    } else {
        return res.status(400).json({ message: 'Invalid appointment data received' });
    }
}


// @desc Update a user
// @route PATCH /users
// @access Private
const updateAppinfo = async (req, res) => {
    const { id, userid, doctorid, doctorname, patientname, mode, bookingDate, appointmentDate } = req.body;

    // Confirm data 
    if (!id || !userid || !doctorid || !doctorname || !patientname || !mode || !bookingDate || !appointmentDate ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Does the user exist to update?
    const appointment = await Appointment.findById(id).exec();

    if (!appointment) {
        return res.status(400).json({ message: 'Appointment details not found' });
    }

    // Check for duplicate 
    const duplicate = await Appinfo.findOne({ doctorname, appointmentDate }).collation({ locale: 'en', strength: 2}).lean().exec();

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    appointment.userid = userid;
    appointment.doctorid = doctorid;
    appointment.doctorname = doctorname;
    appointment.patientname = patientname;
    appointment.mode = mode;
    appointment.bookingDate = bookingDate;
    appointment.appointmentDate = appointmentDate;


    const updated = await Appointment.save();
    res.json({ message: `Appointmnet with ${updated.doctorname} updated` });
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteAppinfo = async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Appointment ID Required' });
    }

    // Does the appointment exist to delete?
    const appointment = await Appointment.findById(id).exec();
    if (!appointment) {
        return res.status(400).json({ message: 'Appointment details not found' });
    }
    const result = await appointment.deleteOne(); //result hold deleted user info
    const reply = `Appointment with ${result.doctorname} with ID ${result._id} deleted`;
    res.json(reply);
}

module.exports = {
    getAllAppinfos,
    getAppinfoByDateDoctor,
    createAppinfo,
    updateAppinfo,
    deleteAppinfo
}