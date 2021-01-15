const bcrypt = require('bcrypt');
const UserModel = require('./models/User');


//Handle generate a new user with a unique ID
function registerNewUser(username, email, password) {

    generateID = () => {
        var generatedUserID = Math.ceil(Math.random(1000,9000)*10000);
        
        UserModel.model('User').find({ ID: generatedUserID }, (err, value) => {
            if(value != null || value.length != 4) {
                generateID();
            } else {
                return generatedUserID;
            }
        });
        return generatedUserID;
    }

    let newID = generateID();
    let user = new UserModel({
        ID: newID,
        username: username,
        email: email,
        password: password,
        registrationDate: Date.now(),
        usernameWithID: username + "#" + newID
    });
    user.save()
    .then(doc => {
        console.log('New user: ', doc);
    })
    .catch(err => {
        console.log(err);
    });

}


//Handle if there is an email already registered in the database
function isAlreadyRegistered(email, username, callback) {
    
    UserModel.model('User').find({
        username: username
    }, (err, value) => {
        if(err) console.log(err);
        if(value[0] != null) {
            callback(true);
        } else {
            UserModel.model('User').find({
                email: email
            }, (err, value) => {
                if(err) console.log(err);
                if(value[0] != null) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        }
    });
}

function loginAuth(username, password, callback) {
   
    UserModel.findOne({
        username: username
    }, (err, value) => {
        if(err) console.log(err);

        if(value != null) {
            bcrypt.compare(password, value.password, function(err, result) {
                if(err) console.log(err);

                if(result){
                    callback(result, value);
                } else {
                    callback(result, {});
                }
            });
        } else {
            UserModel.findOne({
                email: username
            }, (err, value1) => {
                if(err) console.log(err);

                if(value1 != null) {
                    bcrypt.compare(password, value1.password, function(err, result) {
                        if(result){
                            callback(result, value1);
                        } else {
                            callback(result, {});
                        }
                    });
                } else {
                    callback(false, {});
                }
            })
        }
    });
}



module.exports = { registerNewUser, isAlreadyRegistered, loginAuth };