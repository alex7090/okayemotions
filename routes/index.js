const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../config/auth');
const multer = require('multer');
const path = require('path');
var query = require('../config/query');

var transporter = require('../config/nodemailer');
var contrat = require('../config/contrat');
const uuid = require('uuid').v4;
const fs = require("fs");
const disk = require('diskusage');
const os = require('os');
let _path = os.platform() === 'win32' ? 'c:' : '/';
var ffmpeg = require('ffmpeg');
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
var getDimensions = require('get-video-dimensions');
const { getVideoDurationInSeconds } = require('get-video-duration')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        var { firstName, lastName, email, name, plateform, credit, tag, description, customCheck1, customCheck2, signature, link, date, city } = req.body;
        firstName = firstName.replace(/'/g, "''");
        lastName = lastName.replace(/'/g, "''");
        name = name.replace(/'/g, "''");
        credit = credit.replace(/'/g, "''");
        description = description.replace(/'/g, "''");
        description = description.replace(/[\r\n]+/g, " ");
        const ext = path.extname(file.originalname);
        const id = uuid();
        const filepath = `${file.originalname}`;
        // getVideoDurationInSeconds(file.originalname).then((duration) => {
        //     console.log(duration)
        //   })
        contrat(firstName, lastName, email, name, plateform, credit, tag, description, customCheck1, customCheck2, signature, link, date, city, ext, id, filepath);
        query("INSERT INTO public.data (fname, lname, email, vname, credit, platform, link, type, ext, description, tag, storage, city, date, mod) values('" + firstName + "', '" + lastName + "', '" + email + "', '" + name + "', '" + credit + "', '" + plateform + "', '" + id + "', 'file', '" + ext + "', '" + description + "', '" + tag + "', '" + id + "', '" + city + "', '" + date + "', 0)", [], (err, rows) => {
            cb(null, `./${id}/video${ext}`);
        });

    },
})

const upload = multer({ storage });


router.post('/upload', upload.single('file'), (req, res) => {
    var { firstName, lastName, email, name, plateform, credit, tag, description, customCheck1, customCheck2, signature, link, date, city } = req.body;
    firstName = firstName.replace(/'/g, "''");
    lastName = lastName.replace(/'/g, "''");
    name = name.replace(/'/g, "''");
    credit = credit.replace(/'/g, "''");
    description = description.replace(/'/g, "''");
    description = description.replace(/[\r\n]+/g, " ");
    var video_file = fs.createReadStream(req.file.path);
    var video_String = JSON.stringify(video_file);
    var video_res = JSON.parse(video_String);
    try {
        var process = new ffmpeg(video_res.path);
        process.then(function (video) {
            let vertical = (video.metadata.video.resolution.h > video.metadata.video.resolution.w) ? true : false;
            // console.log(video.metadata)
            if (vertical) {
                let tmp = uuid();
                fs.mkdir(tmp, function (e) {
                    if (!e || (e && e.code === 'EEXIST')) {
                        console.log(tmp);
                    } else {
                        console.log(e);
                    }
                });
                video.fnExtractFrameToJPG(tmp, {
                    frame_rate: 1,
                    file_name: 'frame%i'
                }, function (error, files) {
                    if (!error) {
                        console.log(files);
                    }
                    let duration = video.metadata.duration.seconds;
                    let split = duration / 20;
                    let a = split * 5;
                    let b = split * 10;
                    let c = split * 15;
                    mergeImages(
                        [
                            { src: path.join(tmp, `frame_${Math.floor(a)}.jpg`), x: 0, y: 0 },
                            { src: path.join(tmp, `frame_${Math.floor(b)}.jpg`), x: video.metadata.video.resolution.w, y: 0 },
                            { src: path.join(tmp, `frame_${Math.floor(c)}.jpg`), x: video.metadata.video.resolution.w * 2, y: 0 }
                        ], {
                        Canvas: Canvas,
                        Image: Image,
                        width: video.metadata.video.resolution.w * 3
                    })
                        .then(b64 => {
                            let base;
                            b64 = b64.replace(/^data:image\/png;base64,/, "");

                            console.log(path.basename(video_res.path).length)
                            fs.writeFile(video_res.path.slice(0, -path.basename(video_res.path).length).concat("frame.jpg"), b64, { encoding: 'base64' }, function (err) {
                                query("SELECT id FROM public.data where (fname, lname, email, vname, credit, platform, type, description, tag, city, date, mod) = ('" + firstName + "', '" + lastName + "', '" + email + "', '" + name + "', '" + credit + "', '" + plateform + "', 'file', '" + description + "', '" + tag + "', '" + city + "', '" + date + "', 0) ORDER BY id DESC", [], (err, rows) => {
                                    query("UPDATE public.data SET time=" + duration + " WHERE id = " + rows[0].id + ";", [], (err, rows) => {
                                        console.log("time set")
                                    });
                                });
                            });
                        });
                    fs.rmdir(tmp, { recursive: true }, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log(`${tmp} is deleted!`);
                    });
                });
            } else {
                let tmp = uuid();
                fs.mkdir(tmp, function (e) {
                    if (!e || (e && e.code === 'EEXIST')) {
                        console.log(tmp);
                    } else {
                        console.log(e);
                    }
                });
                video.fnExtractFrameToJPG(tmp, {
                    frame_rate: 1,
                    file_name: 'frame%i',
                    keep_aspect_ratio: false
                }, function (error, files) {
                    if (!error) {
                        console.log(files);
                    }
                    let duration = video.metadata.duration.seconds;
                    let split = duration / 20;
                    let a = split * 5;
                    let b = split * 10;
                    let c = split * 15;
                    mergeImages(
                        [
                            { src: path.join(tmp, `frame_${Math.floor(a)}.jpg`), x: 0, y: 0 },
                            { src: path.join(tmp, `frame_${Math.floor(b)}.jpg`), x: video.metadata.video.resolution.w, y: 0 },
                            { src: path.join(tmp, `frame_${Math.floor(c)}.jpg`), x: video.metadata.video.resolution.w * 2, y: 0 }
                        ], {
                        Canvas: Canvas,
                        Image: Image,
                        width: video.metadata.video.resolution.w * 3
                    })
                        .then(b64 => {
                            let base;
                            b64 = b64.replace(/^data:image\/png;base64,/, "");

                            console.log(path.basename(video_res.path).length)
                            fs.writeFile(video_res.path.slice(0, -path.basename(video_res.path).length).concat("frame.jpg"), b64, { encoding: 'base64' }, function (err) {
                                query("SELECT id FROM public.data where (fname, lname, email, vname, credit, platform, type, description, tag, city, date, mod) = ('" + firstName + "', '" + lastName + "', '" + email + "', '" + name + "', '" + credit + "', '" + plateform + "', 'file', '" + description + "', '" + tag + "', '" + city + "', '" + date + "', 0) ORDER BY id DESC", [], (err, rows) => {
                                    query("UPDATE public.data SET time=" + duration + " WHERE id = " + rows[0].id + ";", [], (err, rows) => {
                                        console.log("time set")
                                    });
                                });
                            });
                        });
                    fs.rmdir(tmp, { recursive: true }, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log(`${tmp} is deleted!`);
                    });
                });
            }
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }
    res.send("ok");
});

router.get('/error', (req, res) => res.render('pages/result', { page: "none", fixed: "false", valid: "admin", user: req.user ? 'yes' : 'no' }));

router.get('/upload', (req, res) => res.render('pages/result', { page: "none", fixed: "false", valid: req.query.valid, user: req.user ? 'yes' : 'no' }));

router.post('/delete', ensureAuthenticated, (req, res, next) => {
    const { ID } = req.body;
    let errors = [];
    let folder;

    console.log(ID);
    query("SELECT * FROM public.data WHERE id=" + ID + ";", [], (err, rows) => {
        if (err) {
            errors.push({
                msg: "ID does not exists"
            })
            res.status(400).send({
                errors,
                success: false
            });
        } else {
            folder = rows[0].storage;
            query("DELETE FROM public.data WHERE id=" + ID + ";", [], (err, rows) => {
                if (err) {
                    errors.push({
                        msg: "Error trying to delete data"
                    })
                    res.status(300).send({
                        errors,
                        success: false
                    });
                } else {
                    console.log(folder);
                    fs.rmdirSync("uploads/" + folder + "/", { recursive: true, force: true });
                    res.status(200).send({
                        msg: "Great Success",
                        success: true
                    });
                }
            });
        }
    });

});

router.get('/', (req, res) => res.render('pages/home', { page: "home", fixed: "false", user: req.user ? 'yes' : 'no', platform: req.device.type.toUpperCase() }));

router.get('/submit', (req, res) => res.render('pages/form', { page: "form", fixed: "false", user: req.user ? 'yes' : 'no', platform: req.device.type.toUpperCase() }));

router.get('/moderate', ensureAuthenticated, ensureAdmin, (req, res, next) => {
    query("SELECT *, COALESCE(to_char(created_at, 'YYYY/MM/DD at HH24:MI'), '') AS signed from public.data WHERE mod=0 order by id desc;", [], (err, rows) => {
        if (err) return console.log(err);
        rows.forEach(function (obj) {
            obj.description = obj.description.replace(/'/g, " ");
        });
        let info = disk.checkSync(_path);
        res.render('pages/moderate', {
            page: "none",
            fixed: "true",
            user: req.user ? 'yes' : 'no',
            data: rows,
            size: info.available
        });
    });
});

router.get('/data', ensureAuthenticated, (req, res, next) => {
    query("SELECT *, COALESCE(to_char(created_at, 'YYYY/MM/DD at HH24:MI'), '') AS signed from public.data WHERE mod=1 order by accepted_at DESC;", [], (err, rows) => {
        if (err) return console.log(err);
        rows.forEach(function (obj) {
            obj.description = obj.description.replace(/'/g, " ");
        });
        let info = disk.checkSync(_path);
        res.render('pages/data', {
            page: "none",
            fixed: "true",
            user: req.user ? 'yes' : 'no',
            data: rows,
            size: info.available,
            role: (req.user.id == 1001) ? "admin" : "user",
        });
    });
});




router.post('/contact', (req, res, next) => {
    transporter.sendMail({ 
        from: 'alexandre@de-charry.com',// sender address
        to: 'business@okayemotions.com', // list of receivers
        subject: req.body.Inquiry, // Subject line
        text: `${req.body.firstName} ${req.body.lastName} from  ${req.body.Company} asked: ${req.body.description}\nContact him with ${req.body.email} `, // plain text body
      })
      res.redirect("/");
});




module.exports = router;