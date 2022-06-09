const jwt = require('jsonwebtoken');
const userModel = require("../schemas/user_model");

function authUser(req, res, next) {
    let bearerToken = req.headers.authorization;
    if (!bearerToken) res.status(401).send("Aucune token n'a été fournie");
    else {
        let token = bearerToken.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_PASSWORD, function(err, decoded) {
            if (err) res.status(401).send("Token invalide");
            else {
                let userId = decoded.id;
                userModel.findById(userId, function(err, user) {
                    if (err) res.status(500).send("Une erreur est survenue");
                    else if (!user || !user.actif) res.status(401).send("Token invalide");
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
    if (req.user && req.user.actif && req.user.access_rights && (req.user.access_rights === "ADMIN")) next();
    else res.status(401).send("L'utilisateur n'est pas administrateur");
}

module.exports = { authUser, userIsAdmin };