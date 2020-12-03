const randomize = require('randomatic')
const db = require('../data/db')

const edit = (req, res) => {
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
  db.run(`DELETE FROM rooms WHERE secret_key = "${req.body.secret_key}"`, (err, results) => {
    res.render('get-started', {message: "Room has been successfully deleted"})
  })
}

const room_show_db = (req, res) => {
  db.all('SELECT * FROM rooms', (err, results) => {
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

module.exports = {
  edit, create, join, del, room_show_db
}