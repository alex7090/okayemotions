const express = require('express');
const router = express.Router();
const { ensureAdmin, ensureAuthenticated } = require('../config/auth');
const multer = require('multer');
const path = require('path');
const fs = require("fs");
var query = require('../config/query');
var mime = require('mime-types')
var ffmpeg = require('ffmpeg');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    var { storage, id } = req.body;
    console.log(id);
    const ext = path.extname(file.originalname);
    query("UPDATE public.data SET clips = array_append(clips, '" + file.originalname + "') WHERE id= " + id + "", [], (err, rows) => {
      console.log("test");
      cb(null, `./${storage}/${file.originalname}`);
    });

  },
})

const upload = multer({ storage });




router.post('/clip/add', ensureAuthenticated, ensureAdmin, upload.single('file'), (req, res) => {
  let url = `/watch?id=${req.body.id}`;
  res.redirect(url);
});




router.post('/clip/remove', ensureAuthenticated, ensureAdmin, (req, res) => {
  const { ID, storage, name } = req.body;
  query("UPDATE public.data SET clips = ARRAY_REMOVE(clips, '" + name + "') WHERE id= " + ID + "", [], (err, rows) => {
    if (err) {
      console.error(err)
      res.send("error");
    }
    fs.unlink("uploads/" + storage + "/" + name, (err) => {
      if (err) {
        console.error(err)
        res.send("error");
      }
      res.send("ok");
    })
  });
});

router.get("/clip/", ensureAuthenticated, function (req, res, next) {
  const ID = req.query.id;
  const name = req.query.name;
  const storage = req.query.storage;

  let source = `video?storage=${storage}&video=${name}`;

  res.render('pages/clip', {
    page: "none",
    fixed: "false",
    user: req.user ? 'yes' : 'no',
    role: (req.user.id == 1001) ? "admin" : "user",
    src: source
  });
});

router.get('/clip/dl', ensureAuthenticated, ensureAdmin, (req, res) => res.download(`uploads/${req.query.storage}/${req.query.name}`));


router.get("/miniature", function (req, res, next) {
  query("SELECT storage, ext FROM public.data", [], (err, rows) => {
    if (err) {
      errors.push({
        msg: "Error trying to delete data"
      })
      res.status(300).send({
        errors,
        success: false
      });
    } else {
      console.log(rows);
      res.send("aa");
    }
  });

});





router.get("/watch", ensureAuthenticated, function (req, res, next) {
  const ID = req.query.id;

  query("SELECT *, COALESCE(to_char(created_at, 'YYYY/MM/DD at HH24:MI'), '') AS signed, array_to_json(clips) AS test from public.data WHERE id=" + ID + ";", [], (err, rows) => {
    if (err) {
      if (err) return console.log(err);
    } else {
      var src = `video?storage=${rows[0].storage}&video=video${rows[0].ext}`;
      res.render('pages/landscape', {
        page: "none",
        fixed: "false",
        user: req.user ? 'yes' : 'no',
        data: rows[0],
        src: src,
        role: (req.user.id == 1001) ? "admin" : "user",
        info: rows[0].info
      });
    }
  });
});

router.get("/video", ensureAuthenticated, function (req, res, next) {
  const options = {};

  let start;
  let end;

  const filePath = `uploads/${req.query.storage}/${req.query.video}`;
  const range = req.headers.range;
  if (range) {
    const bytesPrefix = "bytes=";
    if (range.startsWith(bytesPrefix)) {
      const bytesRange = range.substring(bytesPrefix.length);
      const parts = bytesRange.split("-");
      if (parts.length === 2) {
        const rangeStart = parts[0] && parts[0].trim();
        if (rangeStart && rangeStart.length > 0) {
          options.start = start = parseInt(rangeStart);
        }
        const rangeEnd = parts[1] && parts[1].trim();
        if (rangeEnd && rangeEnd.length > 0) {
          options.end = end = parseInt(rangeEnd);
        }
      }
    }
  }

  let type = mime.lookup(filePath);
  res.setHeader("content-type", type);

  fs.stat(filePath, (err, stat) => {
    if (err) {
      console.error(`File stat error for ${filePath}.`);
      console.error(err);
      res.sendStatus(500);
      return;
    }

    let contentLength = stat.size;

    if (req.method === "HEAD") {
      res.statusCode = 200;
      res.setHeader("accept-ranges", "bytes");
      res.setHeader("content-length", contentLength);
      res.end();
    }
    else {
      let retrievedLength;
      if (start !== undefined && end !== undefined) {
        retrievedLength = (end + 1) - start;
      }
      else if (start !== undefined) {
        retrievedLength = contentLength - start;
      }
      else if (end !== undefined) {
        retrievedLength = (end + 1);
      }
      else {
        retrievedLength = contentLength;
      }

      res.statusCode = start !== undefined || end !== undefined ? 206 : 200;

      res.setHeader("content-length", retrievedLength);

      if (range !== undefined) {
        res.setHeader("content-range", `bytes ${start || 0}-${end || (contentLength - 1)}/${contentLength}`);
        res.setHeader("accept-ranges", "bytes");
      }

      const fileStream = fs.createReadStream(filePath, options);
      fileStream.on("error", error => {
        console.log(`Error reading file ${filePath}.`);
        console.log(error);
        res.sendStatus(500);
      });

      fileStream.pipe(res);
    }
  });
  //   const range = req.headers.range;
  //   if (!range) {
  //     res.status(400).send("Requires Range header");
  //   }
  //   const videoPath = `uploads/${req.query.storage}/${req.query.video}`;
  //   const videoSize = fs.statSync(`uploads/${req.query.storage}/${req.query.video}`).size;
  //   const CHUNK_SIZE = 10 ** 6;
  //   const start = Number(range.replace(/\D/g, ""));
  //   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  //   const contentLength = end - start + 1;
  //   const headers = {
  //     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
  //     "Accept-Ranges": "bytes",
  //     "Content-Length": contentLength,
  //     "Content-Type": `video/${req.query.video.slice(6).toLowerCase()}`
  //   };
  //   res.writeHead(206, headers);
  //   const videoStream = fs.createReadStream(videoPath, { start, end });
  //   videoStream.pipe(res);
});

router.get("/image", ensureAuthenticated, function (req, res, next) {
  const folder = `uploads/${req.query.storage}/frame.jpg`;

  try {
    if (fs.existsSync(folder)) {
      res.sendFile(path.resolve(folder))
    } else {
      res.sendFile(path.resolve('public/images/not.png'))
    }
  } catch (err) {
    res.sendFile(path.resolve('public/images/not.png'))
  }

});


router.get('/download', ensureAuthenticated, ensureAdmin, (req, res, next) => res.download(`uploads/${req.query.storage}/${req.query.video}`));

router.get('/contract', ensureAuthenticated, ensureAdmin, (req, res, next) => {
  let storage = req.query.storage;
  res.sendFile(path.resolve(`uploads/${storage}/contrat.pdf`));
});

router.post('/moderate/refuse/', ensureAuthenticated, ensureAdmin, (req, res, next) => {
  const { ID } = req.body;
  let errors = [];
  let folder;

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


router.post('/moderate/accept/', ensureAuthenticated, ensureAdmin, (req, res, next) => {
  const { ID } = req.body;
  let errors = [];

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
      query("UPDATE public.data SET mod = 1, accepted_at = CURRENT_TIMESTAMP(0) WHERE id=" + ID + ";", [], (err, rows) => {
        if (err) {
          errors.push({
            msg: "Error trying to delete data"
          })
          res.status(300).send({
            errors,
            success: false
          });
        } else {
          res.status(200).send({
            msg: "Great Success",
            success: true
          });
        }
      });
    }
  });

});

router.post('/update/insta/', ensureAuthenticated, ensureAdmin, (req, res, next) => {
  const { ID, value } = req.body;
  let errors = [];
  console.log(req.body);
  query("UPDATE public.data SET instagram = '" + value + "' WHERE id=" + ID + ";", [], (err, rows) => {
    if (err) {
      errors.push({
        msg: "Error trying to delete data"
      })
      res.status(300).send({
        errors,
        success: false
      });
    } else {
      res.status(200).send({
        msg: "Great Success",
        success: true
      });
    }
  });
});

router.post('/update/info/', ensureAuthenticated, ensureAdmin, (req, res, next) => {
  const { ID, value } = req.body;
  let new_value = value;
  new_value = new_value.replace(/'/g, " ");
  new_value = new_value.replace(/[\r\n]+/g, " ");
  let errors = [];
  console.log(req.body);
  query("UPDATE public.data SET info = '" + new_value + "' WHERE id=" + ID + ";", [], (err, rows) => {
    if (err) {
      errors.push({
        msg: "Error trying to delete data"
      })
      res.status(300).send({
        errors,
        success: false
      });
    } else {
      res.status(200).send({
        msg: "Great Success",
        success: true
      });
    }
  });
});

router.post('/update/tiktok/on', ensureAuthenticated, ensureAdmin, (req, res, next) => {
  const { ID } = req.body;

  console.log(req.body);
  query("UPDATE public.data SET posted = 1 WHERE id=" + ID + ";", [], (err, rows) => {
    if (err) {
      errors.push({
        msg: "Error trying to delete data"
      })
      res.status(300).send({
        errors,
        success: false
      });
    } else {
      res.status(200).send({
        msg: "Great Success",
        success: true
      });
    }
  });
});

router.post('/update/tiktok/off', ensureAuthenticated, ensureAdmin, (req, res, next) => {
  const { ID } = req.body;

  console.log(req.body);
  query("UPDATE public.data SET posted = 0 WHERE id=" + ID + ";", [], (err, rows) => {
    if (err) {
      errors.push({
        msg: "Error trying to delete data"
      })
      res.status(300).send({
        errors,
        success: false
      });
    } else {
      res.status(200).send({
        msg: "Great Success",
        success: true
      });
    }
  });
});

module.exports = router;