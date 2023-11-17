//(rest operator) ...allowedRoles => parameters, pass many roles
const verifyRoles = (...allowedRoles) => {
    //return middleware function
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        //compare both
        console.log(rolesArray); //roles passed in that will be allowed for particular http m ethod, it actually restricts who can perform the method (required roles to access)
        console.log(req.roles); //array of user roles from jwt, the role of user who is accessing (roles that one possess)
        
        //check if the req roles and possessed roles are present
        //map =. creates new array
        //includes returns true or false
        //find to find 1st true
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;