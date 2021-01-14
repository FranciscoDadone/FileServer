var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var fs = require('fs');
var shell = require('shelljs');
const loginViaCookie = require('../middlewares/loginViaCookie');
var path = require('path');
const UserModel = require('../controller/models/User');


// Middlewares
router.use(fileUpload());
router.use(express.static('public'));

router.get('/:path?', loginViaCookie, (req,res) => {
    if(!req.isAuthenticated) {
        res.redirect('/');
    } else {
        UserModel.findOne({
            email: req.email,
            username: req.username
        }, async (err, value) => {
            if(err) console.log(err);
            let content = { files: [], directories: [] };
            let dir = path.join(__dirname + "/../storage/" + req.username);   

            if(req.params.path && req.query.dirname) { 
                dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + req.query.dirname);
            } else if(req.params.path) {
                dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.params.path.replace(/-/g, '/'));
            } else if(req.query.dirname) {
                dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.query.dirname);
            }
            fs.readdir(dir, async (err, files) => {
                try {
                    files.forEach(file => {
                        if (fs.lstatSync(path.resolve(dir, file)).isDirectory()) {
                            content.directories.push(file);
                        } else {
                            content.files.push(file);
                        }
                    });
                    console.log(dir);
                    res.render('home', {
                        title: 'Cloud',
                        user: req.user,
                        status: req.query.status,
                        content: content,
                        path: "/home" + req.path,
                        pathWithoutHome: req.path,
                        req: req
                    });
                } catch (error) {
                    res.render('home', {
                        title: 'Cloud',
                        user: req.user,
                        status: req.query.status,
                        content: content,
                        path: "/home" + req.path,
                        pathWithoutHome: req.path,
                        req: req
                    });
                }
            });
        });
    }
});

// POST
router.post('/:path?', loginViaCookie, (req, res) => {
    if(!req.files || Object.keys(req.files).length === 0 || !req.isAuthenticated) {
        if(!req.files || Object.keys(req.files).length === 0){
            res.redirect('/home?status=err');
        } else if(!req.isAuthenticated) {
            res.render('home', {
                user: req.user,
                status: "Please log-in to upload files",
                content: req.content
            });
        }
    } else {
        if(req.files){
            const file = req.files.filename;

            if(file.length == undefined) {
                if(req.params.path == undefined && req.query.dirname) {
                    var route = "./storage/" + req.username + "/" + req.query.dirname + "/" + file.name;
                    var dir = "./storage/" + req.username + "/" + req.query.dirname;
                } else if(req.params.path != "" && req.query.dirname == undefined) {
                    var route = "./storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + file.name;
                    var dir = "./storage/" + req.username + "/" + req.params.path.replace(/-/g, '/');
                } else if(req.params.path && req.query.dirname){
                    var route = "./storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + req.query.dirname + "/" + file.name;
                    var dir = "./storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + req.query.dirname;
                } else {
                    var route = "./storage/" + req.username + "/" + file.name;
                    var dir = "./storage/" + req.username;
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

                    if(req.params.path == undefined && req.query.dirname) {
                        var route = "./storage/" + req.username + "/" + req.query.dirname + "/" + file[i].name;
                        var dir = "./storage/" + req.username + "/" + req.query.dirname;
                    } else if(req.params.path != "" && req.query.dirname == undefined) {
                        var route = "./storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + file[i].name;
                        var dir = "./storage/" + req.username + "/" + req.params.path.replace(/-/g, '/');
                    } else if(req.params.path && req.query.dirname){
                        var route = "./storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + req.query.dirname + "/" + file[i].name;
                        var dir = "./storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + req.query.dirname;
                    } else {
                        var route = "./storage/" + req.username + "/" + file[i].name;
                        var dir = "./storage/" + req.username;
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
            var r = '/home/' + req.params.path + '?status=success'
            console.log(r);
            res.redirect(r);
        }
    }
});

module.exports = router;
