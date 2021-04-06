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

router.get('/db-points', roomController.room_show_db_points)

// function post_session_view(req, res) {
//   const room_id = req.body.room_id
//   const hasDoneRemote = req.body.has_done_remote
//   const hasDoneRadio = req.body.has_done_radio
//   const hasDoneArrange = req.body.has_done_arrange
//   const hasDoneWater = req.body.has_done_water

//   const data = {room_id, hasDoneRemote, hasDoneRadio, hasDoneArrange, hasDoneWater}


//   res.render('post-session', {...data})
// }



router.post('/post-session', upload.none(), roomController.post_session)

router.get('/post-session', function(req, res) {
  // res.redirect('room-join')
  res.send('wait')
})

router.get('/archive', function(req, res) {
  res.send('wait lang din')
})

router.post('/archive', upload.none(), roomController.archive)



// router.get('/post-session', function(req, res) {
//   console.log(req.query)
//   const encString = req.query.data
//   const room_id = req.query.room_id
//   const hasDoneRemote = encString.charAt(0) == '1' ? true : false
//   const hasDoneRadio = encString.charAt(1) == '1' ? true : false
//   const hasDoneArrange = encString.charAt(2) == '1' ? true : false
//   const hasDoneWater = encString.charAt(3) == '1' ? true : false
//   const data = {room_id, hasDoneRemote, hasDoneRadio, hasDoneArrange, hasDoneWater}
//   res.render('post-session', {...data})
// })

// router.get('/post-session', get_processed_data, post_session_view)

module.exports = router