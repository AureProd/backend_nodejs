
/**
 * Function for return the welcome message for the HomePage of Backend 
 * 
 * @returns {string}
 */
function homePage(res, req) {
    res.send("Welcome to the Backend");
}

module.exports = {homePage};