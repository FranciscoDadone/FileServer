const cryptoRandomString = require('crypto-random-string');
const UserModel = require('../controller/models/User');
const bcrypt = require('bcrypt');

function generateCookie(value, callback) {

    var crypto = cryptoRandomString({length: 40});

    UserModel.updateOne({ 
        email: value.email,
        ID: value.ID
     }, 
     { authCookie: crypto }, {upsert: false}, function(err, doc) {
        if (err) return console.log(err);
    });

    bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(crypto, salt, (err, hash) => {
                    if(err) throw err;


                    let cookieValue = value.ID + hash;
                    callback(cookieValue);
                    
            }));
}






module.exports = { generateCookie };