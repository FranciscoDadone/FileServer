var express = require('express');
var router = express.Router();
const loginViaCookie = require('../middlewares/loginViaCookie');
var path = require('path');
var DecompressZip = require('decompress-zip');



router.post('/:path?', loginViaCookie, (req, res, next) => {

    var dir = path.join(__dirname + "/../public/storage/" + req.username + "/" + req.body.file);
    var out = path.join(__dirname + "/../public/storage/" + req.username);
    var url = 'home';

    if(req.body.path != '-undefined' && req.body.path != undefined) {
        dir = path.join(__dirname + "/../public/storage/" + req.username + "/" + req.body.path.replace(/-/g, '/').replace('/undefined', '') + "/" + req.body.file);
        out = path.join(__dirname + "/../public/storage/" + req.username + "/" + req.body.path.replace(/-/g, '/').replace('/undefined', ''));
        url = path.join("home/" + req.body.path.replace(/-/g, '/').replace('/undefined', ''));
    }
    if(req.body.dirname != undefined) {
        dir = path.join(__dirname + "/../public/storage/" + req.username + "/" + req.body.dirname + "/" + req.body.file);
        out = path.join(__dirname + "/../public/storage/" + req.username + "/" + req.body.dirname);
    }

    if(req.body.dirname != undefined && req.body.path != undefined) {
        dir = path.join(__dirname + "/../public/storage/" + req.username + "/" + req.body.path.replace(/-/g, '/').replace('/undefined', '') + "/" + req.body.dirname + "/" + req.body.file);
        out = path.join(__dirname + "/../public/storage/" + req.username + "/" + req.body.path.replace(/-/g, '/').replace('/undefined', '') + "/" + req.body.dirname);
        url = path.join('home' + req.body.path.replace(/-/g, '/').replace('/undefined', ''));
    }

    var unzipper = new DecompressZip(dir)
    unzipper.on('error', function (err) {
        console.log(err);
        res.redirect(url + '/?status=decompressingFailed')
    });

    unzipper.on('extract', function (log) {
        console.log('Finished extracting');
        res.redirect(url + '/?status=decompressing');
    });

    unzipper.on('progress', function (fileIndex, fileCount) {
        console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
    });

    unzipper.extract({
    path: out,
    filter: function (file) {
        return file.type !== "SymbolicLink";
    }
    });
});

module.exports = router;