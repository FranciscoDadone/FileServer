var express = require('express');
var router = express.Router();
const loginViaCookie = require('../middlewares/loginViaCookie');

router.use(express.static('public'));

router.get('/image', loginViaCookie, (req, res) => {

    let path = req.query.path.replace(/-/g, '/'), 
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
        url += "/" + path1 + "/" + req.query.img;
    } else {
        url += "/" + req.query.img;
    }

    res.render('images', {
        url: url,
        img: req.query.img,
        layout: 'blank-layout'
    });
});

router.get('/doc', loginViaCookie, (req, res) => {

    let path = req.query.path.replace(/-/g, '/'), 
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
        url += "/" + path1 + "/" + req.query.file;
    } else {
        url += "/" + req.query.file;
    }

    res.render('doc', {
        url: url,
        file: req.query.file
    });

});



module.exports = router;