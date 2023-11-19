//use in profile update
const Userinfo = require('../../models/Userinfo');

//Desc for each func

// @desc Get all users
// @route GET /users
// @access Private
const getAllUserinfos = async (req, res) => {
    // Get all users from MongoDB
    const users = await Userinfo.find().lean(); //dont return password, lean=> give only json data not methods
    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }

    res.json(users);
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUserinfoAll = async (req, res) => {
    const { id, userid, username, anonymousname, lastname, firstname, gender, dob, contactno, email, address, active } = req.body;

    // Confirm data 
    if (!id || !userid || !username || !anonymousname || !lastname || !firstname || !gender || !dob || !contactno || !email || !address || active ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Does the user exist to update?
    const user = await Userinfo.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
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
    user.active = active;

    const updatedUser = await user.save();
    res.json({ message: `${updatedUser.username} updated` });
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUserinfo = async (req, res) => {
    const { id, userid, username, anonymousname, lastname, firstname, gender, dob, contactno, email, address, active } = req.body;

    // Confirm data 
    if (!id || !userid || !username || !anonymousname || !lastname || !firstname || !gender || !dob || !contactno || !email || !address || !active) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Does the user exist to update?
    const user = await Userinfo.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
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

    const updatedUser = await user.save();
    res.json({ message: `${updatedUser.username} updated` });
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUserinfo = async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    // Does the user exist to delete?
    const user = await Userinfo.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const result = await user.deleteOne(); //result hold deleted user info
    const reply = `Username ${result.username} with ID ${result._id} deleted`;
    res.json(reply);
}

module.exports = {
    getAllUserinfos,
    updateUserinfoAll,
    updateUserinfo,
    deleteUserinfo
}