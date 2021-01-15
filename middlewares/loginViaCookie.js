const bcrypt = require('bcrypt');
let UserModel = require('../controller/models/User');

module.exports = function loginViaCookie(req, res, next) {
    try {
        if(req.cookies.auth != null) {

            var cookie = req.cookies.auth;
            var userID = "";
            var cookieToUnhash = "";
    
            for (let i = 0; i < cookie.length; i++) {
                if(i < 4){
                    userID += cookie[i];
                } else {
                    cookieToUnhash += cookie[i];
                }
            }
            
            UserModel.findOne({
                ID: userID
            }, (err, value) => {
                if(err) console.log(err);
                bcrypt.compare(value.authCookie, cookieToUnhash, function(err, result) {
                    if(err) console.log(err);
                    if(result) {
                        req.isAuthenticated = true;
                        req.email = value.email;
                        req.username = value.username;
                        req.user = value
                        next();
                    } else {
                        req.isAuthenticated = false;
                        next();
                    }
                });
    
            });
    
        } else {
            next();
        }
    } catch(err) {
        req.isAuthenticated = false;
        next();
    }
};