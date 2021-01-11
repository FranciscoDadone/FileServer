var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var fs = require('fs');
var shell = require('shelljs');



// Middlewares
router.use(fileUpload());

router.get('/:path?', (req, res) => {
  console.log(req.params.path);
  res.send(req.params.path);

});

// POST
router.post('/:path?', (req, res) => {
    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({message: 'No files uploaded'});
    }
    if(req.files){
    
        const file = req.files.filename;

        if(file.length == undefined) {
            try {
                var a = req.params.path;
                var route = "./storage/" + a.replace(/-/g, '/') + "/" + file.name;
                var dir = "./storage/" + a.replace(/-/g, '/');
            } catch (error) {
                var route = "./storage/" + file.name;
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
                    var route = "./storage/" + a.replace(/-/g, '/') + "/" + file[i].name;
                    var dir = "./storage/" + a.replace(/-/g, '/');
                } catch (error) {
                    var route = "./storage/" + file[i].name;
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
       res.send('[message: "Files uploaded"]');
    }
});

module.exports = router;
