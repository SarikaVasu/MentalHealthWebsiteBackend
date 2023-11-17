const Doctorlogin = require('../../models/Doctorlogin');
const Doctorinfo = require('../../models/Doctorinfo');
const Userinfo = require('../../models/Userinfo');
const Userlogin = require('../../models/Userlogin');
const jwt = require('jsonwebtoken');

const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await Userlogin.findOne({ username: decoded.username }).exec();
            const foundUser2 = await Userinfo.findOne({ username: decoded.username }).exec()

            if(foundUser) {
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "id": foundUser._id,
                            "id1": foundUser2._id,
                            "username": foundUser.username,
                            "identity": "user",
                            "anonymousname": foundUser.anonymousname,
                            "roles": foundUser.roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                )
    
                res.json({ accessToken })
            }

            if (!foundUser) {
                const foundUser3 = await Doctorlogin.findOne({ username: decoded.username }).exec();
                const foundUser4 = await Doctorinfo.findOne({ username: decoded.username }).exec();
                if (!foundUser3) {
                    return res.status(401).json({ message: 'Unauthorized' });
                } else {
                    const accessToken = jwt.sign(
                        {
                            "UserInfo": {
                                "id": foundUser3._id,
                                "id1": foundUser4._id,
                                "username": foundUser3.username,
                                "identity": "doctor",
                                "anonymousname": foundUser3.anonymousname,
                                "roles": foundUser3.roles
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '15m' }
                    )
        
                    res.json({ accessToken })
                }
            }
        }
    )
}

module.exports = { refresh }