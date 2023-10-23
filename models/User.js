const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String, 
    password: String,
    resetToken: String,
    resetTokenExpiration: Date,
    location: String,   //for recommendation
    purchaseHistory: [String]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

