const jwt = require('jsonwebtoken');

function sendUserInformations(req, res, next) {
    res.status(200).json({
        username: req.user.username,
        email: req.user.email,
        access_rights: req.user.access_rights,
        email_verified: req.user.email_verified
    });
}

function sendUserToken(req, res, next) {
    res.status(200).json({
        jwt: jwt.sign({
            id: req.user._id
        }, process.env.TOKEN_PASSWORD, {
            algorithm: 'HS384',
            expiresIn: "1h"
        }),
        email_verified: req.user.email_verified
    }); 
}

module.exports = { sendUserInformations, sendUserToken };