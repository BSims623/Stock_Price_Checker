const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: String,
    likes: Array
});

module.exports = mongoose.model('User', UserSchema);