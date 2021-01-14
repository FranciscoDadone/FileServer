var express = require('express');
var router = express.Router();
var fs = require('fs');
var shell = require('shelljs');
const loginViaCookie = require('../middlewares/loginViaCookie');
var path = require('path');

router.post('/:path?', loginViaCookie, (req, res) => {
    let dirRedirect = req.params.path;
    
    let dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.query.filename);
    if(req.params.path != '-undefined' || req.params.path != undefined) {
        dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.params.path.replace(/-/g, '/').replace('/undefined', '') + "/" + req.query.filename);
        console.log(req.params.path)
    }

    if(dirRedirect == '-undefined') {
        dirRedirect = "/";
    }
    
    shell.rm(dir);
    console.log(dir + " DELETED");
    res.redirect("/home/" + dirRedirect.replace('-undefined', ''));

});

module.exports = router;