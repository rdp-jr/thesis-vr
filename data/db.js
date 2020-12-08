const sqlite = require('sqlite3')

const db = new sqlite.Database('./data/database.db', (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connected to Database')
  }
})

module.exports = db