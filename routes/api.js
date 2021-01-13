var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var fs = require('fs');
var shell = require('shelljs');
const loginViaCookie = require('../middlewares/loginViaCookie');

// Middlewares
router.use(fileUpload());

/*router.get('/:path?', loginViaCookie, (req, res) => {
  console.log(req.params.path);
  res.send(req.params.path);

});*/
const url = require('url');    

// POST
router.post('/:path?', loginViaCookie, (req, res) => {
    if(!req.files || Object.keys(req.files).length === 0 || !req.isAuthenticated) {
        if(!req.files || Object.keys(req.files).length === 0){
            res.render('home', {
                user: req.user,
                status: "Please select a file to upload."
            });
        } else if(!req.isAuthenticated) {
            res.render('home', {
                user: req.user,
                status: "Please log-in to upload files."
            });
        }
    } else {
        if(req.files){
    
            const file = req.files.filename;
            if(file.length == undefined) {
                try {
                    var a = req.params.path;
                    var route = "./storage/" + req.username + "/" + a.replace(/-/g, '/') + "/" + file.name;
                    var dir = "./storage/" + req.username + a.replace(/-/g, '/');
                } catch (error) {
                    var route = "./storage/" + req.username + "/" + file.name;
                }
                console.log('Receiving file: ' + route);
    
                if(!fs.existsSync(dir)) {
                    console.log("Creating directory: " + dir);
                    shell.mkdir('-p', dir);
                }
    
                file.mv(route, function (err){
                    if(err){
                        fs.mkdir(dir, function(er) {
                            console.log(er);
                        });
                    }
                })
            
            } else {
                for(let i = 0 ; i < file.length; i++){
                
                    try {
                        var a = req.params.path;
                        var route = "./storage/" + req.username + "/" + a.replace(/-/g, '/') + "/" + file[i].name;
                        var dir = "./storage/" + req.username + "/" + a.replace(/-/g, '/');
                    } catch (error) {
                        var route = "./storage/" + req.username + "/" + file[i].name;
                    }
                    console.log('Receiving file: ' + route);
                    
                    if(!fs.existsSync(dir)) {
                        console.log("Creating directory: " + dir);
                        shell.mkdir('-p', dir);
                    }
    
                    file[i].mv(route, function (err){
                        if(err){
                            res.send(err);
                        }
                    })
                }
            }
            res.render('home', {
                user: req.user,
                status: "Files uploaded!"
            });
        }
    }
});

module.exports = router;
