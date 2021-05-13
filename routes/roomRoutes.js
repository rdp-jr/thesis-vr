const express = require('express')
const router = express.Router()
const roomController = require('../controllers/roomController')
const fs = require('fs')
const multer = require('multer')
const db = require('../data/db')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const room_code = req.body.room_code
    fs.mkdirSync(`./data/rooms/${room_code}/`, { recursive: true }, (err) => { if (err) throw err })
    cb(null, `./data/rooms/${room_code}/`)

  },
  filename: function (req, file, cb) {
    const room_code = req.body.room_code
    const ext = file.originalname.split(".")


    const file_name = `${room_code}_${file.fieldname}.${ext[ext.length - 1]}`

    cb(null, file_name)

    // const path = `/rooms/${room_code}/${file_name}`
    // db.run(`UPDATE rooms SET ${file.fieldname} = "${path}" WHERE room_code = "${room_code}"`)
  }
})  

const upload = multer({ storage:storage })

router.get('/', function(req, res) {
  res.render('room-join')
})

router.get('/join', function(req, res) {
  res.render('room-join')
})

router.post('/join', upload.none(), roomController.join)

router.get('/create', function(req, res) {
  res.render('room-create')
})
router.post('/create', upload.none(), roomController.create)

router.get('/secret', function(req, res) {
  res.render('room-secret')
})

router.post('/secret', upload.none(), roomController.secret)

router.get('/edit', function(req, res) {
  res.redirect('/room/secret')
})

const fields = [
  {name: "video_1", maxCount: 1 },
  {name: "music_1", maxCount: 1 },
  {name: "wall_1", maxCount: 1 },
  {name: "wall_2", maxCount: 1 },
  {name: "book_cover_1", maxCount: 1 },
  {name: "movie_poster_1", maxCount: 1 },
  {name: "scrapbook_1", maxCount: 1 },
  {name: "scrapbook_2", maxCount: 1 },
  {name: "scrapbook_3", maxCount: 1 },
  {name: "scrapbook_4", maxCount: 1 } 
]

router.post('/edit', upload.fields(fields), roomController.edit)

router.get('/delete', function(req, res) {
  res.redirect('/room/secret')
})

router.post('/delete', upload.none(), roomController.del)

router.get('/db', roomController.room_show_db)

router.get('/db-points', roomController.room_show_db_points)

router.post('/post-session', upload.none(), roomController.post_session)

router.get('/post-session', function(req, res) {
  res.send('wait')
})

router.get('/archive', function(req, res) {
  res.send('wait lang din')
})

router.post('/archive', upload.none(), roomController.archive)

// router.get('/room-test', function(req, res) {
//   res.render('room-test')
// })

router.get('/join-test', upload.none(), roomController.join_test)

router.get('/join-test2', upload.none(), roomController.join_test2)

module.exports = router