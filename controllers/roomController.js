const randomize = require('randomatic')
const db = require('../data/db')
const fs = require('fs').promises
const fs2 = require('fs')

function get_asset_video_or_audio_path(room_code, field_name, type) {
  var path = `./data/rooms/${room_code}/${room_code}_${field_name}`
  var path_final = `/rooms/${room_code}/${room_code}_${field_name}`
  var ret = ''
  if (type == 'video') {
    if (fs2.existsSync(path + '.mp4')) {
      ret = path_final + '.mp4'
    } else {
      ret = `/static/assets/videos/default_video.mp4`
    }
  } else {
    if (fs2.existsSync(path + '.mp3')) {
      ret = path_final + '.mp3'
    } else {
      ret = `/static/assets/audio/default_radio.mp3`
    }
  }

  // console.log(ret)


  return ret
} 


function get_asset_image_path(room_code, field_name) {
  var path = `./data/rooms/${room_code}/${room_code}_${field_name}`
  var path_final = `/rooms/${room_code}/${room_code}_${field_name}`
  var ret = ''
  if (fs2.existsSync(path + '.jpg')) {
    // console.log('jpg exist')
    ret = path_final + '.jpg'
  } else if (fs2.existsSync(path + '.jpeg')) {
    // console.log('jpeg  exist')
    ret = path_final + '.jpeg'
  } else {
    // console.log('using default ret')
    ret = `/static/assets/img/default_${field_name}.jpg`
  }

  return ret

}

const edit = (req, res) => {
  console.log(req.body)

  const room_code = req.body.room_code
  const secret_key = req.body.secret_key
  const wall_1 = get_asset_image_path(room_code, 'wall_1')
  const wall_2 = get_asset_image_path(room_code, 'wall_2')
  const movie_poster_1 = get_asset_image_path(room_code, 'movie_poster_1')
  const book_cover_1 = get_asset_image_path(room_code, 'book_cover_1')
  const scrapbook_1 = get_asset_image_path(room_code, 'scrapbook_1')
  const scrapbook_2 = get_asset_image_path(room_code, 'scrapbook_2')
  const scrapbook_3 = get_asset_image_path(room_code, 'scrapbook_3')
  const scrapbook_4 = get_asset_image_path(room_code, 'scrapbook_4')
  const video_1 = get_asset_video_or_audio_path(room_code, 'video_1', 'video')
  const music_1 = get_asset_video_or_audio_path(room_code, 'music_1', 'audio')

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
      // console.log(results)
      // const data = {...results, wall_1, wall_2}
      var room_code = results['room_code']
      const data = {room_code, secret_key, video_1, music_1, wall_1, wall_2, movie_poster_1, book_cover_1, scrapbook_1, scrapbook_2, scrapbook_3, scrapbook_4}
      // console.log(data)
      res.render('room-edit', data)
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
    db.run(`INSERT INTO rooms (room_code, secret_key) VALUES ("${room_code}", "${secret_key}")`)
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

  const room_code = req.body.room_code

  db.get(`SELECT * FROM rooms WHERE room_code = "${req.body.room_code}"`, (err, results) => {
    if (results) {
      const wall_1 = get_asset_image_path(room_code, 'wall_1')
      const wall_2 = get_asset_image_path(room_code, 'wall_2')
      const movie_poster_1 = get_asset_image_path(room_code, 'movie_poster_1')
      const book_cover_1 = get_asset_image_path(room_code, 'book_cover_1')
      const scrapbook_1 = get_asset_image_path(room_code, 'scrapbook_1')
      const scrapbook_2 = get_asset_image_path(room_code, 'scrapbook_2')
      const scrapbook_3 = get_asset_image_path(room_code, 'scrapbook_3')
      const scrapbook_4 = get_asset_image_path(room_code, 'scrapbook_4')
      const video_1 = get_asset_video_or_audio_path(room_code, 'video_1', 'video')
      const music_1 = get_asset_video_or_audio_path(room_code, 'music_1', 'audio')
      const data = {room_code, video_1, music_1, wall_1, wall_2, movie_poster_1, book_cover_1, scrapbook_1, scrapbook_2, scrapbook_3, scrapbook_4}
      res.render('room', data)
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