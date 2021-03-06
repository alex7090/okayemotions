const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const multer = require('multer');
const path = require('path');
var query = require('../config/query');
const uuid = require('uuid').v4;
const fs = require("fs");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        var { fname, lname, email, vname, credit, media } = req.body;
        const ext = path.extname(file.originalname);
        const id = uuid();
        const filepath = `${id}${ext}`;
        query("INSERT INTO public.data (fname, lname, email, vname, credit, media, link, type) values('" + fname + "', '" + lname + "', '" + email + "', '" + vname + "', '" + credit + "', '" + media + "', '" + filepath + "', 'upload')", [], (err, rows) => {
            cb(null, filepath);
        });
    },
})

const upload = multer({ storage });

router.get('/', (req, res) => {
    res.render('home');

});

router.get('/data',ensureAuthenticated, (req, res) => {
    query("SELECT * from public.data", [], (err, rows) => {
        if (err) return next(err);
        console.log(rows);
        res.render('data', {
            data: rows
        });
    });
});

router.get('/new', (req, res) => {
    res.render('new');
});
router.get('/new/upload', (req, res) => {
    res.render('upload');

});
router.get('/new/link', (req, res) => {
    res.render('link');

});

router.post('/new/link', (req, res) => {
    var { fname, lname, email, vname, credit, media, link } = req.body;
    query("INSERT INTO public.data (fname, lname, email, vname, credit, media, link) values('" + fname + "', '" + lname + "', '" + email + "', '" + vname + "', '" + credit + "', '" + media + "', '" + link + "')", [], (err, rows) => {
        if (err) return next(err);
        res.redirect('/');
    });
});
router.post('/new/upload', upload.single('file'), (req, res) => {
    res.redirect('/');
});


router.get('/watch', (req, res) => {
    res.render('video');

});
router.get("/video", function (req, res) {
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }

    // get video stats (about 61MB)
    const videoPath = "uploads/a60f3792-0bc3-44df-8c62-ca269f8d34bd.mp4";
    const videoSize = fs.statSync("uploads/a60f3792-0bc3-44df-8c62-ca269f8d34bd.mp4").size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
});


router.get('/download',ensureAuthenticated, (req, res) => {
    res.download('./uploads/'+ req.query.video);
});

module.exports = router;