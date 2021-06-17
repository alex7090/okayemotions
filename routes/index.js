const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../config/auth');
const multer = require('multer');
const path = require('path');
var query = require('../config/query');
var contrat = require('../config/contrat');
const uuid = require('uuid').v4;
const fs = require("fs");
const disk = require('diskusage');
const os = require('os');
let _path = os.platform() === 'win32' ? 'c:' : '/';
var ffmpeg = require('ffmpeg');

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
        contrat(firstName, lastName, email, name, plateform, credit, tag, description, customCheck1, customCheck2, signature, link, date, city, ext, id, filepath);
        query("INSERT INTO public.data (fname, lname, email, vname, credit, platform, link, type, ext, description, tag, storage, city, date, mod) values('" + firstName + "', '" + lastName + "', '" + email + "', '" + name + "', '" + credit + "', '" + plateform + "', '" + id + "', 'file', '" + ext + "', '" + description + "', '" + tag + "', '" + id + "', '" + city + "', '" + date + "', 0)", [], (err, rows) => {
            cb(null, `./${id}/video${ext}`);
        });

    },
})

const upload = multer({ storage });


router.post('/upload', upload.single('file'), (req, res) => {
    var url = `/upload?valid=${req.file ? 'yes' : 'no'}`;

    var video_file = fs.createReadStream(req.file.path); // Storing File path
    var video_String = JSON.stringify(video_file); // Converting Json into String of req.file.path
    var video_res = JSON.parse(video_String); // Parsing req.file.path
    try {
        var process = new ffmpeg(video_res.path);
        process.then(function (video) {
            console.log(video.metadata.video.resolution)
            let time = '00:00:03';
            console.log(video.metadata.video.rotate)
            if (video.metadata.duration.seconds > 50) {
                time = '00:00:30'
            } else {
                let div = video.metadata.duration.seconds / 2;
                if (div >= 10) {
                    time = `00:00:${div}`
                } else {
                    time = `00:00:0${div}`
                }
            }
            console.log(time);
            video.addCommand('-ss', time)
            video.addCommand('-vframes', '1')
            video.save(video_res.path.slice(0, -9).concat("frame.jpg"), function (error, file) {
                if (!error)
                    console.log('Video file: ' + file);
            });
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }



    res.redirect(url);
});

router.get('/error', (req, res) => res.render('pages/result', { fixed: "false", valid: "admin", user: req.user ? 'yes' : 'no' }));

router.get('/upload', (req, res) => res.render('pages/result', { fixed: "false", valid: req.query.valid, user: req.user ? 'yes' : 'no' }));

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

router.get('/', (req, res) => res.render('pages/form', { fixed: "false", user: req.user ? 'yes' : 'no', platform: req.device.type.toUpperCase() }));

router.get('/moderate', ensureAuthenticated, ensureAdmin, (req, res, next) => {
    query("SELECT *, COALESCE(to_char(created_at, 'YYYY/MM/DD at HH24:MI'), '') AS signed from public.data WHERE mod=0 order by id desc;", [], (err, rows) => {
        if (err) return console.log(err);
        rows.forEach(function (obj) {
            obj.description = obj.description.replace(/'/g, " ");
        });
        let info = disk.checkSync(_path);
        res.render('pages/moderate', {
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
        res.render('pages/new_data', {
            fixed: "true",
            user: req.user ? 'yes' : 'no',
            data: rows,
            size: info.available,
            role: (req.user.id == 1001) ? "admin" : "user",
        });
    });
});

router.get('/bdd', ensureAuthenticated, (req, res, next) => {
    console.log(req.user);
    if (req.user.id == process.env.TMP_ADMIN_ID) {
        query("SELECT *, COALESCE(to_char(created_at, 'YYYY/MM/DD at HH24:MI'), '') AS signed from public.data order by id desc;", [], (err, rows) => {
            if (err) return console.log(err);
            rows.forEach(function (obj) {
                obj.description = obj.description.replace(/'/g, " ");
            });
            let info = disk.checkSync(_path);
            res.render('pages/data', {
                fixed: "false",
                user: req.user ? 'yes' : 'no',
                data: rows,
                size: info.available
            });
        });
    } else if (req.user.id == process.env.TMP_USER_ID) {
        query("SELECT id, vname, platform, type, ext, description, tag, platform, storage, city, date  from public.data order by id desc;", [], (err, rows) => {
            if (err) return console.log(err);
            rows.forEach(function (obj) {
                obj.description = obj.description.replace(/'/g, " ");
            });
            res.render('pages/tmp_data', {
                fixed: "false",
                user: req.user ? 'yes' : 'no',
                data: rows
            });
        });
    }
});

module.exports = router;