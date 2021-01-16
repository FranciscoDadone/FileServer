var express = require('express');
var router = express.Router();
//var fileUpload = require('express-fileupload');
var fs = require('fs-extra');
var shell = require('shelljs');
const loginViaCookie = require('../middlewares/loginViaCookie');
var path = require('path');
const UserModel = require('../controller/models/User');


// Middlewares
//router.use(fileUpload());
router.use(express.static('public'));

const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy

router.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware


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
            let dir = path.join(__dirname + "/../public/storage/" + req.username);   

            if(req.params.path && req.query.dirname) { 
                dir = path.join(__dirname + "/../public/storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + req.query.dirname);
            } else if(req.params.path) {
                dir = path.join(__dirname + "/../public/storage/" + req.username + "/" + req.params.path.replace(/-/g, '/'));
            } else if(req.query.dirname) {
                dir = path.join(__dirname + "/../public/storage/" + req.username + "/" + req.query.dirname);
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
    if(!req.busboy || Object.keys(req.busboy).length === 0 || !req.isAuthenticated) {
        if(!req.busboy || Object.keys(req.busboy).length === 0){
            var r = '/home/?status=err';
            if(req.params.path != undefined) {
                r = '/home/' + req.params.path + '?status=err';
            } else if(req.query.dirname != undefined) {
                r = '/home/' + req.query.dirname + '?status=err';
            }
            if((req.params.path != undefined) && (req.query.dirname != "")) {
                r = '/home/' + req.params.path + "-" + req.query.dirname + '?status=err';
            }
            res.redirect(r);
        } else if(!req.isAuthenticated) {
            res.render('home', {
                user: req.user,
                status: "Please log-in to upload files",
                content: req.content
            });
        }
    } else {
        if(req.busboy){
                req.pipe(req.busboy); // Pipe it trough busboy
                
                req.busboy.on('file', (fieldname, file, filename) => {
                    console.log(`Upload of '${filename}' started`);

                    var route = "./public/storage/" + req.username + "/" + filename, 
                        dir = "./public/storage/" + req.username;

                    if(req.params.path == undefined && req.query.dirname) {
                        route = "./public/storage/" + req.username + "/" + req.query.dirname + "/" + filename;
                        dir = "./public/storage/" + req.username + "/" + req.query.dirname;
                    } else if(req.params.path != undefined && req.query.dirname == undefined) {
                        route = "./public/storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + filename;
                        dir = "./public/storage/" + req.username + "/" + req.params.path.replace(/-/g, '/');
                    } else if(req.params.path && req.query.dirname){
                        route = "./public/storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + req.query.dirname + "/" + filename;
                        dir = "./public/storage/" + req.username + "/" + req.params.path.replace(/-/g, '/') + "/" + req.query.dirname;
                    }

                    if(!fs.existsSync(dir)) {
                        console.log("Creating directory: " + dir);
                        shell.mkdir('-p', dir);
                    }

                    const fstream = fs.createWriteStream(route);
                    file.pipe(fstream);

                    // On finish of the upload
                    fstream.on('close', () => {
                        console.log(`Upload of '${filename}' finished`);

                        res.redirect('back'); //fallback
                    });
                });
            }
    }
});

module.exports = router;
