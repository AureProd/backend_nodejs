const userModel = require("../schemas/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailController = require("../functions/mail_controller");

function loginRequest(req, res, next) {
    let time = new Date();

    function loginDelayError() {
        const wait_time = 3 * 1000;

        let timeDiff = wait_time - (new Date() - time);
        if (timeDiff < 0) res.status(500).send("Une erreur est survenue");

        setTimeout(() => res.status(400).send("Informations incorrectes"), timeDiff) 
    }

    if(!req.body.email || !req.body.password) loginDelayError();
    else {
        let email = req.body.email;
        let password = req.body.password;
        userModel.findOne({email: email}, function(err, user) {
            if (err) res.status(500).send("Une erreur est survenue");
            else if (!user) loginDelayError();
            else {
                bcrypt.compare(password, user.password, function(err, result) {
                    if (err) res.status(500).send("Une erreur est survenue");
                    else if (!result) loginDelayError();
                    else {
                        req.user = user;
                        next();
                    }
                });
            }
        });
    }
}

function registerRequest(req, res, next) {
   if (!req.body.username || !req.body.email || !req.body.password) res.status(400).send("Informations incorrectes");
    else {
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        userModel.findOne({username: username, email: email}, function(err, user) {
            if(err) res.status(500).send("Une erreur est survenue");
            else if(user) res.status(400).send("Informations incorrectes");
            else {
                userModel.create({
                    username: username,
                    email: email,
                    password: bcrypt.hashSync(password, 10)
                }, function(err, user) {
                    if(err) res.status(500).send("Une erreur est survenue");
                    else {
                        req.user = user;
                        next();
                    }
                });
            }
        });
    }
}

function sendMailVerifEmail(req, res, next) {
    if(!req.user) res.status(400).send("Informations incorrectes");
    else if(req.user.email_verified) next();
    else {
        let emailToken = jwt.sign({
            id: req.user._id
        }, process.env.TOKEN_EMAIL_PASSWORD, {
            algorithm: 'HS384',
            expiresIn: "1h"
        });

        mailController.sendMail(
            "Confirmation de l'adresse email", 
            `
                <p>Veuillez confirmer votre adresse email en cliquant sur le bouton suivant : <a href="${process.env.FRONTEND_VERIF_EMAIL_URL.replace("<TOKEN>", emailToken)}" target="_blank">Confirmer votre adresse email</a></p>
                <p>Token : ${emailToken}</p>
                <br>
                <p>Si vous n'avez pas demandé cette confirmation, veuillez ignorer ce mail.</p>
            `,
            req.user.email
        );

        next();
    }
}

function verifEmail(req, res, next) {
    if (!req.body.token) res.status(400).send("Informations incorrectes");
    else {
        let token = req.body.token;
        jwt.verify(token, process.env.TOKEN_EMAIL_PASSWORD, function(err, decoded) {
            if (err) res.status(400).send("Token invalide");
            else {
                let userId = decoded.id;
                userModel.findById(userId, function(err, user) {
                    if (err) res.status(500).send("Une erreur est survenue");
                    else if (!user) res.status(400).send("Token invalide");
                    else {
                        user.email_verified = true;
                        user.save();
                        
                        res.status(200).send("Email vérifié");
                    }
                });
            }
        });
    }
}

function sendMailLostPassword(req, res, next) {
    if(!req.user) res.status(400).send("Informations incorrectes");
    else {
        let passwordToken = jwt.sign({
            id: req.user._id
        }, process.env.TOKEN_EMAIL_PASSWORD, {
            algorithm: 'HS384',
            expiresIn: "1h"
        });

        mailController.sendMail(
            "Changer votre mot de passe", 
            `
                <p>Veuillez changer votre mot de passe en cliquant sur le bouton suivant : <a href="${process.env.FRONTEND_lOST_PASSWORD_URL.replace("<TOKEN>", passwordToken)}" target="_blank">Changer votre mot de passe</a></p>
                <p>Token : ${passwordToken}</p>
                <br>
                <p>Si vous n'avez pas demandé ce changement de mot de passe, veuillez ignorer ce mail.</p>
            `,
            req.user.email
        );

        res.status(200).send("Email envoyé pour changer de mot de passe"); 
    }
}

function changePassword(req, res, next) {
    if (!req.body.token || !req.body.password) res.status(400).send("Informations incorrectes");
    else {
        let token = req.body.token;
        let newPassword = req.body.password;
        jwt.verify(token, process.env.TOKEN_EMAIL_PASSWORD, function(err, decoded) {
            if (err) res.status(400).send("Token invalide");
            else {
                let userId = decoded.id;
                userModel.findById(userId, function(err, user) {
                    if (err) res.status(500).send("Une erreur est survenue");
                    else if (!user) res.status(400).send("Token invalide");
                    else {
                        user.password = bcrypt.hashSync(newPassword, 10);
                        user.save();
                        
                        res.status(200).send("Password correctement changé");
                    }
                });
            }
        });
    }
}

module.exports = { registerRequest, loginRequest, sendMailVerifEmail, verifEmail, sendMailLostPassword, changePassword };