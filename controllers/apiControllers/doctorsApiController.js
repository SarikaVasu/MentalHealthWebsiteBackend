//use in profile update
const Doctorinfo = require('../../models/Doctorinfo');
const Doctorlogin = require('../../models/Doctorlogin');

//Desc for each func

// @desc Get all users
// @route GET /users
// @access Private
const getAllDoctorinfos = async (req, res) => {
    // Get all users from MongoDB
    const users = await Doctorinfo.find().lean(); //dont return password, lean=> give only json data not methods

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }

    res.json(users);
}


// @desc Update a user
// @route PATCH /users
// @access Private
const updateDoctorinfo = async (req, res) => {
    const { id, username, anonymousname, lastname, firstname, gender, dob, contactno, email, address, degree, college, clinic, clinicContact, experience } = req.body;

    // Confirm data 
    if (!id || !username || !anonymousname || !lastname || !firstname || !gender || !dob || !contactno || !email || !address || !degree || !college || !clinic || !clinicContact || !experience ) {
        return res.status(400).json({ message: 'All fields except password are required' });
    }

    // Does the user exist to update?
    const user = await Doctorinfo.findById(id).exec();
    const login = await Doctorlogin.findOne({ userid: user.userid }).exec(); 

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate 
    const duplicate = await Doctorinfo.findOne({ username }).collation({ locale: 'en', strength: 2}).lean().exec();

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    user.username = username;  
    user.anonymousname = anonymousname;
    user.lastname = lastname;
    user.firstname = firstname;
    user.gender = gender;
    user.dob = dob;
    user.contactno = contactno;
    user.email = email;
    user.address = address;
    user.degree = degree;
    user.college = college;
    user.clinic = clinic;
    user.clinicContact = clinicContact;
    user.experience = experience;

    login.username = username;   
    login.anonymousname = anonymousname;

    const updatedUser = await user.save();
    const updatedLogin = await login.save();
    res.json({ message: `${updatedUser.username} updated` });
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteDoctorinfo = async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    // Does the user exist to delete?
    const user = await Doctorinfo.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const result = await user.deleteOne(); //result hold deleted user info
    const reply = `Username ${result.username} with ID ${result._id} deleted`;
    res.json(reply);
}

module.exports = {
    getAllDoctorinfos,
    updateDoctorinfo,
    deleteDoctorinfo
}