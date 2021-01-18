const express = require('express');
const router = express.Router();
const loginViaCookie = require('../middlewares/loginViaCookie');
const fs = require('fs');

router.use(express.static('public'));

router.get('/image', loginViaCookie, (req, res) => {

    let path = req.query.path.replace('/', '').replace(/-/g, '/'), 
        path1 = '', 
        pstart = 0, 
        pend = 0;

        if(path[0] == '/' || path[path.length - 1] == '/') {
        if(path[0] == '/') { pstart = 1 }
        if(path[path.length - 1] == '/') { pend = 1 }

        for(let i = 0 + pstart; i < path.length - pend; i++) {
            path1 += path[i];
        }
    }

    let url = 'storage/' + req.username;
    if(path1 != "") {
        url += "/" + path1 + "/";
    } else {
        url += "/";
    }
    if(req.query.dirname) {
        url += req.query.dirname + "/";
    }

    url += req.query.img;

    res.render('images', {
        url: url,
        img: req.query.img,
        layout: 'blank-layout'
    });
});

router.get('/doc', loginViaCookie, (req, res) => {


    let path = '';
    if(req.query.path != undefined && req.query.path != '') {
        path = req.query.path.replace(/([/])/g, '').replace(/-/g, '/');
    } else {
        path = '/';
    }
    console.log(path)
    let url = 'public/storage/' + req.username,
        webUrl = '/home/';
    if(path != "") {
        url += "/" + path + "/";
        webUrl += path.replace(/([/])/g, '-');
    } else {
        url += "/";
    }

    if(req.query.dirname) {
        url += req.query.dirname + "/";
        if(path != '' && path != undefined) {
            webUrl += "-" + req.query.dirname;
        } else {
            webUrl += req.query.dirname;
        }
    }

    url += req.query.file;

    fs.readFile(url, 'utf8', function(err, data) {
        if (err) {
            res.render('doc', {
                file: req.query.file,
                url: url,
                content: err,
                webUrl: webUrl,
                status: err
            });
        } else {
            res.render('doc', {
                file: req.query.file,
                content: data,
                url: url,
                webUrl: webUrl,
                status: ''
            });
        }
    });
});

router.post('/saveDoc', loginViaCookie, (req, res) => {

    fs.writeFile(req.body.url, req.body.textarea, function(err) {
        if(err){ 
            res.render('doc', {
                file: req.body.file,
                url: req.body.url,
                content: req.body.textarea,
                webUrl: req.body.webUrl,
                status: 'err'
            });
        } else {
            res.render('doc', {
                file: req.body.file,
                url: req.body.url,
                content: req.body.textarea,
                webUrl: req.body.webUrl,
                status: 'OK'
            });
        }
    });    
});



module.exports = router;