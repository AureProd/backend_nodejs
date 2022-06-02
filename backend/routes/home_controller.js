const userModel = require('../schemas/user_schema');

/**
 * Function for return the welcome message for the HomePage of Backend 
 * 
 * @returns {string}
 */
function homePage(req, res, next) {
    let user = new userModel({
        name: 'John Doe'
    });
    
    user.save();

    res.send("Welcome to the Backend");
}

module.exports = { homePage };