//use in profile update
const Userlogin = require('../models/Userlogin');
const Userinfo = require('../models/Userinfo');
const Deletedlogin = require('../models/Deletedlogin');
const Deleteduserinfo = require('../models/Deleteduserinfo');
const bcrypt = require('bcrypt');

//Desc for each func

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    const users = await Userlogin.find().select('-password').lean(); //dont return password, lean=> give only json data not methods

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }

    res.json(users);
}

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { username, password, roles } = req.body;


    // Confirm data
    if (!username || !password ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate username
    const duplicate = await Userlogin.findOne({ username }).collation({ locale: 'en', strength: 2}).lean().exec(); //exec while using async await
    //stength=>case insensitivity


    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' }); //conflict
    }

    const maxUser = await (Userlogin.find().sort({userid:-1}).limit(1));
    const userid = maxUser[0].userid + 1;

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10); // 10 salt rounds


    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { "userid": userid, username, "password": hashedPwd, "anonymousname": 'Anonymous'+String(7000+Number(`${userid}`)) }
        : { "userid": userid, username, "password": hashedPwd, "anonymousname": 'Anonymous'+String(7000+Number(`${userid}`)), roles }


    // Create and store new user 
    const user = await Userlogin.create(userObject);

    const info = await Userinfo.create({
        "userid": userid,
        "username": username,
        "anonymousname": 'Anonymous'+String(7000+Number(`${userid}`)),
    })
    
    if (user && info) { //created 
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' });
    }

    // Does the user exist to update?
    const user = await Userlogin.findById(id).exec();
    const info = await Userinfo.findOne({ userid: user.userid }).exec(); 

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate 
    const duplicate = await Userlogin.findOne({ username }).collation({ locale: 'en', strength: 2}).lean().exec();

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    user.username = username;   
    user.roles = roles;
    user.active = active;

    info.username = username;   
    info.active = active;

    //update pswd
    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10); // salt rounds 
    }

    const updatedUser = await user.save();
    const updatedInfo = await info.save();
    res.json({ message: `${updatedUser.username} updated` });
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    // Does the user exist to delete?
    const user = await Userlogin.findById(id).exec();
    const info = await Userinfo.findOne({ userid: user.userid }).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const del1 = await Deletedlogin.create({
        assignedId: user.userid,
        type: "User",
        username: user.username,
        password: user.password,
        anonymousname: user.anonymousname,
        roles: user.roles,
        active: false,
        deletedAt: new Date(),
    });
    const del2 = await Deleteduserinfo.create({
        userid: info.userid,
        username: info.username,
        anonymousname: info.anonymousname,
        firstname: info.firstname,
        lastname: info.lastname,
        gender: info.gender,
        dob: info.dob,
        contactno: info.contactno,
        email: info.email,
        address: info.address,
        active: false,
        deletedAt: new Date(),
    });
    const result = await user.deleteOne(); //result hold deleted user info 
    const infoResult = await info.deleteOne(); 

    const reply = `Username ${result.username} with ID ${result._id} deleted`;
    res.json(reply);
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}