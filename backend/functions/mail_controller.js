const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/**
 * Envoi un mail à gautier concernant les nouvelles entreprises
 * 
 * @param {string} objet objet du mail
 * @param {string} contenu contenu du mail avec du html
 * @param {string} emailTarget adresse email du destinataire
 * @returns {void} 
 */
function sendMail(objet, contenu, emailTarget) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_ACCOUNT_EMAIL,
            pass: process.env.GMAIL_ACCOUNT_PASSWORD
        }
    });

    transporter.sendMail({
        from: process.env.GMAIL_ACCOUNT_EMAIL,
        to: emailTarget,
        subject: objet,
        html: contenu
    }, function(error, info){
        if (error) console.log(error);
        else console.log(`Email sent to email '${emailTarget}'`);
    });
}

module.exports = { sendMail };