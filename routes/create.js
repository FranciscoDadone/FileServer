var express = require('express');
var router = express.Router();
var fs = require('fs');
var shell = require('shelljs');
const loginViaCookie = require('../middlewares/loginViaCookie');
var path = require('path');

router.post('/:path?', loginViaCookie, (req, res) => {
    let dirRedirect = req.params.path;
    let dir;
    

    if(req.body.newFolder != undefined) {
        dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.body.newFolder);
        console.log(req.params.path);
        if(req.params.path != '-undefined' && req.params.path != undefined) {
            console.log("1")
            
            dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.params.path.replace(/-/g, '/').replace('/undefined', '') + "/" + req.body.newFolder);
        } else if(req.query.dirname != undefined) {
            console.log("2")
            dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.query.dirname + "/" + req.body.newFolder);
        }
    }

    if(dirRedirect == '-undefined' || dirRedirect == undefined) {
        dirRedirect = "/";
    }
    
    shell.mkdir(dir);
    console.log(dir + " CREATED");

    
    res.redirect("/home/" + dirRedirect.replace('-undefined', ''));

});

module.exports = router;