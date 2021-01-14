var express = require('express');
var router = express.Router();
const loginViaCookie = require('../middlewares/loginViaCookie');
var path = require('path');

router.post('/:path?', loginViaCookie, (req, res) => {
    let dirRedirect = req.params.path;
    let dir;
    

    if(req.query.filename != undefined) {
        dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.query.filename);
    }

    if(req.params.path != '-undefined' && req.params.path != undefined && req.query.filename != undefined) {    
        dir = path.join(__dirname + "/../storage/" + req.username + "/" + req.params.path.replace(/-/g, '/').replace('/undefined', '') + "/" + req.query.filename);
    }

    if(dirRedirect == '-undefined' || dirRedirect == undefined) {
        dirRedirect = "/";
    }
    
    res.download(dir);

    console.log(dir + " DOWNLOADED");
});

module.exports = router;