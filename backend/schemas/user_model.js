const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    access_rights: {type: String, enum: ["USER", "ADMIN"], default: "USER", required: true},
    updated_date: {type: Date, required: true, default: Date.now},
    created_date: {type: Date, required: true, default: Date.now},
    actif: {type: Boolean, required: true, default: true},
    email_verified: {type: Boolean, required: true, default: false},
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
