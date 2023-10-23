const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String, 
    password: String,
    resetToken: String,
    resetTokenExpiration: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;

