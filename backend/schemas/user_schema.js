const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required : true}
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;