const randomize = require('randomatic')
const db = require('../data/db')

const edit = (req, res) => {
  db.get(`SELECT * FROM rooms WHERE secret_key = "${req.body.secret_key}"`, (err, results) => {
    if (results) {
      console.log(results)
      res.render('room-edit', {...results})
    } else {
      // add error page
      res.send('get-started')
    }
  })
}

const create = (req, res) => {
  if ('checkbox' in req.body) {
    const room_code = randomize('0', 6)
    const secret_key = randomize('aA0', 10)

    //add error handling logic
    db.run(`INSERT INTO rooms (room_code, secret_key, image_1) VALUES ("${room_code}", "${secret_key}", NULL)`)
    res.render('room-create-success', {room_code, secret_key})
    
  } else {
    res.render('get-started')
  }
}

const del = (req, res) => {
  db.run(`DELETE FROM rooms WHERE secret_key = "${req.body.secret_key}"`, (err, results) => {
    if (results) {
      // console.log(results)
      // res.render('room-edit', {...results})
      res.send('successfully deleted room')
    } else {
      // add error page
      res.send('get-started')
    }
  })
}

const room_show_db = (req, res) => {
  db.all('SELECT * FROM rooms', (err, results) => {
    res.json(results)
  })
}

const join = (req, res) => {
  // add error handling
  db.get(`SELECT * FROM rooms WHERE room_code = "${req.body.room_code}"`, (err, results) => {
    if (results) {
      console.log(results)
      res.render('room', {...results})
    } else {
      // add error page
      res.send('get-started')
    }
  })
}

module.exports = {
  edit, create, join, del, room_show_db
}