
/**
 * Function for return the welcome message for the HomePage of Backend 
 * 
 * @returns {string}
 */
function homePage(req, res, next) {
    res.send("Welcome to the Backend");
}

module.exports = {homePage};