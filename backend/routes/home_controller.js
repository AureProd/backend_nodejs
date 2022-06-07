
function homePage(req, res, next) {
    res.status(200).send("Welcome to the Backend");
}

module.exports = { homePage };