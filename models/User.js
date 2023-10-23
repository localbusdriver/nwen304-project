const mongoose = require('mongoose');

mongoose.set('debug', true);  

const UserSchema = new mongoose.Schema({
    username: String,
    email: String, 
    password: String,
    resetToken: String,
    resetTokenExpiration: Date,
    location: String,//for recommendation
    purchaseHistory: [String] //for recommendation
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

