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
    // console.log('===========upload==========')
    // console.log(req.body)
    const room_code = req.body.room_code
    const ext = file.originalname.split(".")


    const file_name = `${room_code}_${file.fieldname}.${ext[ext.length - 1]}`

    cb(null, file_name)

    const path = `/rooms/${room_code}/${file_name}`
    db.run(`UPDATE rooms SET ${file.fieldname} = "${path}" WHERE room_code = "${room_code}"`)
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

router.post('/secret', upload.none(), roomController.edit)

router.get('/edit', function(req, res) {
  res.redirect('/room/secret')
})

const fields = [
  {name: "image_1", maxCount: 1 },
  {name: "image_2", maxCount: 1 },
  {name: "video_1", maxCount: 1},
  {name: "music_1", maxCount: 1}
]
router.post('/edit', upload.fields(fields), roomController.edit)

router.get('/delete', function(req, res) {
  res.redirect('/room/secret')
})

router.post('/delete', upload.none(), roomController.del)





router.get('/db', roomController.room_show_db)

module.exports = router