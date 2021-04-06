const randomize = require('randomatic')
const db = require('../data/db')
const fs = require('fs').promises

const edit = (req, res) => {
  console.log(req.body)


  const name = req.body.patient_name
  const age = req.body.patient_age

  if (name || age) {
    var sql = `UPDATE rooms SET patient_name = ?, patient_age = ? WHERE secret_key = ?`
    db.run(sql, [name, age, req.body.secret_key], function(err) {
      if (err) {
        return console.log(err.message)
      }

      console.log('updated successfully')
    })
  }


  db.get(`SELECT * FROM rooms WHERE secret_key = "${req.body.secret_key}"`, (err, results) => {
    if (results) {
      console.log('Room has been edited')
      console.log(results)
      res.render('room-edit', {...results})
    } else {
      res.render('room-secret', {error: 'Secret key does not match'})
    }
  })
}

const create = (req, res) => {
  if ('checkbox' in req.body) {
    const room_code = randomize('0', 6)
    const secret_key = randomize('aA0', 10)

    //add error handling logic
    db.run(`INSERT INTO rooms (room_code, secret_key, image_1) VALUES ("${room_code}", "${secret_key}", NULL)`)
    console.log('Room has been created')
    console.log(`Room Code: ${room_code} Secret Key: ${secret_key}`)
    res.render('room-create', {success: true, room_code, secret_key})
    
  } else {
    res.render('room-create', {error: "You cannot create a room if you do not agree with the Data Privacy Policy"})
  }
}

const del = (req, res) => {
  db.get(`SELECT * FROM rooms WHERE secret_key = "${req.body.secret_key}"`, (err, results) => {
    if (results) {
      const directory = `data/rooms/${req.body.room_code}`
      fs.rmdir(directory, { recursive: true })
        .then(() => console.log('directory removed!'));

    } else {
      res.render('room-secret', {error: 'Secret key does not match'})
    }
  })


  db.run(`DELETE FROM rooms WHERE secret_key = "${req.body.secret_key}"`, (err, results) => {
    res.render('get-started', {message: "Room has been successfully deleted"})
  })
}

const room_show_db = (req, res) => {
  db.all('SELECT * FROM rooms', (err, results) => {
    res.json(results)
  })
}

const room_show_db_points = (req, res) => {
  db.all('SELECT * FROM points', (err, results) => {
    res.json(results)
  })
}

const join = (req, res) => {
  db.get(`SELECT * FROM rooms WHERE room_code = "${req.body.room_code}"`, (err, results) => {
    if (results) {
      res.render('room', {...results})
    } else {
      res.render('room-join', {error: `Room ${req.body.room_code} does not exist`})
    }
  })
}

const post_session = (req, res) => {
  console.log(req.body)
  const room_id = req.body.room_id
  var has_done_remote = (req.body.has_done_remote == 'true') ? 1 : 0
  var has_done_radio = (req.body.has_done_radio == 'true') ? 1 : 0
  var has_done_arrange = (req.body.has_done_arrange == 'true') ? 1 : 0
  var has_done_water = (req.body.has_done_water == 'true') ? 1 : 0
  const timestamp = Date.now()
  console.log('post session saving...')
  const notes = ""
    
  // console.log(has_done_remote)
  // console.log(has_done_radio)
  // console.log(has_done_arrange)
  // console.log(has_done_water)

  //db save
  db.run(`INSERT INTO points (room_id, has_done_remote, has_done_radio, has_done_arrange, has_done_water, timestamp, notes) VALUES ("${room_id}", "${has_done_remote}", "${has_done_radio}","${has_done_arrange}","${has_done_water}","${timestamp}","${notes}")`)

  const data = {room_id, has_done_remote, has_done_radio, has_done_arrange, has_done_water}


  res.render('post-session', {...data})
}

const archive = (req, res) => {
  const room_code = req.body.room_code
  const secret_key = req.body.secret_key
  db.all(`SELECT * FROM points WHERE room_id = "${req.body.room_code}"`, (err, results) => {
    if (results) {
      console.log(results)
      res.render('archive', {'session':results, secret_key, room_code})
    } else {
      // res.render('room-join', {error: `Room ${req.body.room_code} does not exist`})
      res.send('wait implement ko to mamaya')
    }
  })

 
}
  


module.exports = {
  edit, create, join, del, room_show_db, post_session, room_show_db_points, archive
}