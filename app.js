const path = require("path")
const express = require("express") 
const exphbs = require('express-handlebars')
const roomRoutes = require('./routes/roomRoutes')
const indexRoutes = require('./routes/indexRoutes')
require('dotenv').config()
process.title = "networked-aframe-server"

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.static('data'))
app.use(express.urlencoded({ extended: true }))

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main',
}))
app.set('view engine', 'hbs')

// Serve the example and build the bundle in development.
if (process.env.NODE_ENV === "development") {
  const webpackMiddleware = require("webpack-dev-middleware")
  const webpack = require("webpack")
  const config = require("../webpack.dev")
  app.use(
    webpackMiddleware(webpack(config), {
      publicPath: "/dist/"
    })
  )
}

const http = require('http').createServer(app) 
const io = require('socket.io')(http)

const rooms = {}

io.on("connection", socket => {
  console.log("user connected", socket.id)

  let curRoom = null

  socket.on("joinRoom", data => {
    const { room } = data

    if (!rooms[room]) {
      rooms[room] = {
        name: room,
        occupants: {},
      }
    }

    const joinedTime = Date.now()
    rooms[room].occupants[socket.id] = joinedTime
    curRoom = room

    console.log(`${socket.id} joined room ${room}`)
    socket.join(room)

    socket.emit("connectSuccess", { joinedTime })
    const occupants = rooms[room].occupants
    io.in(curRoom).emit("occupantsChanged", { occupants })
  })

  socket.on("send", data => {
    io.to(data.to).emit("send", data)
  })

  socket.on("broadcast", data => {
    socket.to(curRoom).broadcast.emit("broadcast", data)
  })

  socket.on("disconnect", () => {
    console.log('disconnected: ', socket.id, curRoom)
    if (rooms[curRoom]) {
      console.log("user disconnected", socket.id)

      delete rooms[curRoom].occupants[socket.id]
      const occupants = rooms[curRoom].occupants
      socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants })

      if (occupants == {}) {
        console.log("everybody left room")
        delete rooms[curRoom]
      }
    }
  })
})

// Routes Section
app.use(indexRoutes)
app.use('/room', roomRoutes)

http.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT)
})