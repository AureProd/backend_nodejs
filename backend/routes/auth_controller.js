const userModel = require("../schemas/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailController = require("../functions/mail_controller");

/**
 * Function to return error with delay to avoid bruteforce attack and compte listing
 * 
 * @param {Date} time 
 * @param {Number} wait_time 
 * @param {Number} statusCode 
 * @param {String} errorMessage 
 */
function loginDelayError(time) {
    const wait_time = 3 * 1000;

    let timeDiff = wait_time - (new Date() - time);
    if (timeDiff < 0) res.status(500).send("Une erreur est survenue");

    setTimeout(() => res.status(400).send("Informations incorrectes"), timeDiff) 
}

function loginRequest(req, res, next) {
    let time = new Date();

    if(!req.body.email || !req.body.password) loginDelayError(time);
    else {
        userModel.findOne({email: req.body.email}, function(err, user) {
            if (err) res.status(500).send("Une erreur est survenue");
            else if (!user) loginDelayError(time);
            else {
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if (err) res.status(500).send("Une erreur est survenue");
                    else if (!result) loginDelayError(time);
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
        userModel.findOne({username: req.body.username, email: req.body.email}, function(err, user) {
            if(err) res.status(500).send("Une erreur est survenue");
            else if(user) res.status(400).send("Informations incorrectes");
            else {
                userModel.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10)
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
        }, process.env.TOKEN_PASSWORD, {
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

module.exports = { registerRequest, loginRequest, sendMailVerifEmail };