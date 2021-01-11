const Mongoose = require('mongoose');

let User = new Mongoose.Schema({

    ID: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    authCookie: {
        type: String,
        required: false,
        unique: false,
        default: "Invalid"
    },
    friends: {
        type: Array,
        required: false,
        unique: false
    },
    avatar: {
        type: String,
        required: false,
        unique: false
    },
    registrationDate: {
        type: Date,
        required: true,
        unique: false,
        delfault: Date.now()
    },
    usernameWithID: {
        type: String,
        required: true,
        unique: true
    },
    lastLogin: {
        type: Date
    }
    
});


module.exports = Mongoose.model('User', User);