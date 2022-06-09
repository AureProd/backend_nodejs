
function homePage(req, res, next) {
    res.status(200).send("Bienvenue sur ce Backend");
}

module.exports = { homePage };