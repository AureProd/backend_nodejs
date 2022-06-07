const jwt = require("jsonwebtoken");
const userModel = require("../schemas/user_model");

function authUser(req, res, next) {
    let bearerToken = req.headers.authorization;
    if (!bearerToken) res.status(401).send("Unauthorized: No token provided");
    else {
        let token = bearerToken.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_PASSWORD, function(err, decoded) {
            if (err) res.status(401).send("Unauthorized: Invalid token");
            else {
                let userId = decoded.id;
                userModel.findById(userId, function(err, user) {
                    if (err) res.status(500).send("Une erreur est survenue");
                    else if (!user) res.status(401).send("Unauthorized: Invalid token");
                    else {
                        req.user = user;
                        next();
                    }
                });
            }
        });
    }
}

function userIsAdmin(req, res, next) {
    if (req.user && req.user.access_rights && req.user.access_rights == "ADMIN") next();
    else res.status(401).send("Unauthorized: User is not admin");
}

module.exports = { authUser, userIsAdmin };