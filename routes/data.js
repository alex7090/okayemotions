const express = require('express');
const router = express.Router();
const { ensureAdmin, ensureAuthenticated } = require('../config/auth');
const multer = require('multer');
const path = require('path');
const fs = require("fs");
var query = require('../config/query');
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
    fixed: "false",
    user: req.user ? 'yes' : 'no',
    role: (req.user.id == 1001) ? "admin" : "user",
    src: source
  });
});



const _storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    var { storage, id } = req.body;
    console.log(id);
    cb(null, `./${storage}/${file.originalname}`);

  },
})

const _fix = multer({ storage });








router.get("/fix", ensureAuthenticated, ensureAdmin, function (req, res, next) {
  const ID = req.query.id;
  const storage = req.query.storage;

  query("SELECT * from public.data WHERE id=" + ID + ";", [], (err, rows) => {
    if (err) {
      return console.log(err);
    } else {
      res.render('pages/fix', {
        fixed: "false",
        user: req.user ? 'yes' : 'no',
        role: (req.user.id == 1001) ? "admin" : "user",
        data: rows[0]
      });
    }
  });
});

router.post('/fix', ensureAuthenticated, ensureAdmin, _fix.single('file'), (req, res) => {
  let url = `/watch?id=${req.body.id}`;
  res.redirect(url);
});








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
      try {
        var process = new ffmpeg(`uploads/${rows[0].storage}/video${rows[0].ext}`);
        process.then(function (video) {
          if (video.metadata.video.resolution.h > video.metadata.video.resolution.w) {
            console.log("PORTAIT")
            res.render('pages/portrait', {
              fixed: "false",
              user: req.user ? 'yes' : 'no',
              data: rows[0],
              src: src,
              role: (req.user.id == 1001) ? "admin" : "user",
              info: JSON.stringify(rows[0].info)
            });
          } else {
            console.log("LANDSCAPE")
            res.render('pages/landscape', {
              fixed: "false",
              user: req.user ? 'yes' : 'no',
              data: rows[0],
              src: src,
              role: (req.user.id == 1001) ? "admin" : "user",
              info: rows[0].info
            });
          }
        }, function (err) {
          console.log('Error: ' + err);
          res.render('pages/landscape', {
            fixed: "false",
            user: req.user ? 'yes' : 'no',
            data: rows[0],
            src: src,
            role: (req.user.id == 1001) ? "admin" : "user",
            info: rows[0].info
          });
        });
      } catch (e) {
        console.log(e.code);
        console.log(e.msg);
        res.render('pages/landscape', {
          fixed: "false",
          user: req.user ? 'yes' : 'no',
          data: rows[0],
          src: src,
          role: (req.user.id == 1001) ? "admin" : "user",
          info: rows[0].info
        });
      }
    }
  });
});

router.get("/video", ensureAuthenticated, function (req, res, next) {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  const videoPath = `uploads/${req.query.storage}/${req.query.video}`;
  const videoSize = fs.statSync(`uploads/${req.query.storage}/${req.query.video}`).size;
  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
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