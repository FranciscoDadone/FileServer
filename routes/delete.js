var express = require('express');
var router = express.Router();
var fs = require('fs');
var shell = require('shelljs');
const loginViaCookie = require('../middlewares/loginViaCookie');
var path = require('path');

router.post('/:path?', loginViaCookie, (req, res) => {
    let dirRedirect = req.params.path;
    let dir;
    

    if(req.query.filename != undefined) {
        dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.query.filename);
    } else if(req.query.dirname != undefined) {
        dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.query.dirname);
    }

    if(req.params.path != '-undefined' && req.params.path != undefined) {
        if(req.query.filename != undefined) {
            dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.params.path.replace(/-/g, '/').replace('/undefined', '') + "/" + req.query.filename);
        } else if(req.query.dirname != undefined) {
            dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.params.path.replace(/-/g, '/').replace('/undefined', '') + "/" + req.query.dirname);
        }
    }

    if(dirRedirect == '-undefined' || dirRedirect == undefined) {
        dirRedirect = "/";
    }
    
    if(fs.lstatSync(path.resolve(dir)).isDirectory()) {
        shell.rm('-rf', dir);
    } else {
        shell.rm(dir);
    }

    console.log(dir + " DELETED");
    res.redirect("/home/" + dirRedirect.replace('-undefined', ''));

});

module.exports = router;