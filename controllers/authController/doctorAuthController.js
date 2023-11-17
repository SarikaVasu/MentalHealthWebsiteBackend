const Doctorlogin = require('../../models/Doctorlogin');
const Doctorinfo = require('../../models/Doctorinfo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const doctorSignup = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // check for duplicate usernames in the db
    const duplicate = await Doctorlogin.findOne({ username }).collation({ locale: 'en', strength: 2}).lean().exec();
    if (duplicate) return res.status(409).json({ message: 'Duplicate username' }) //Conflict

    try {
        const maxUser = await (Doctorlogin.find().sort({doctorid:-1}).limit(1));
        const doctorid = maxUser[0].doctorid + 1;
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10)

        //create and store the new user
        const result = await Doctorlogin.create({
            "doctorid": doctorid,
            "username": username,
            "password": hashedPwd,
            "anonymousname": 'Anonymous'+String(80000+Number(`${doctorid}`)),
        })

        const doctorinfo = await Doctorinfo.create({
            "doctorid": doctorid,
            "username": username,
            "anonymousname": 'Anonymous'+String(80000+Number(`${doctorid}`)),
        })


        res.status(201).json({ message: `New user ${username} created!` })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// @desc Login
// @route POST /auth
// @access Public
const doctorSignin = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await Doctorlogin.findOne({ username }).exec()
    const foundUser2 = await Doctorinfo.findOne({ username }).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser._id,
                "id1": foundUser2._id,
                "username": foundUser.username,
                "identity": "doctor",
                "anonymousname": foundUser.anonymousname,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https   
        sameSite: 'None', //cross-site cookie 
        maxAge: 2 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const doctorSignout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    doctorSignup,
    doctorSignin,
    // refresh,
    doctorSignout
}