// Load required modules
const http = require("http"); 
const path = require("path");
const express = require("express"); 
const expbs = require('express-handlebars');
const nanoid = require('nanoid');


var multer = require('multer')

var curr_room_code = nanoid.nanoid(10);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'app/assets/images/')
  },
  filename: function (req, file, cb) {
    console.log('WAHAHHAA')
    console.log(curr_room_code)
    cb(null, `${curr_room_code}_${file.fieldname}.jpg`)
  }
})

var upload = multer({ storage:storage })

// Set process name
process.title = "networked-aframe-server";

// Get port or default to 8080
const port = process.env.PORT || 8080;

// Setup and configure Express http server.
const app = express();
app.use(express.static(path.resolve(__dirname, "..", "app")));
app.use(express.static('public'));

app.engine('handlebars', expbs({defaultLayout: false}))
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../app'));

// Serve the example and build the bundle in development.
if (process.env.NODE_ENV === "development") {
  const webpackMiddleware = require("webpack-dev-middleware");
  const webpack = require("webpack");
  const config = require("../webpack.dev");

  app.use(
    webpackMiddleware(webpack(config), {
      publicPath: "/dist/"
    })
  );
}

// Start Express http server
const webServer = http.createServer(app);
const io = require("socket.io")(webServer);

const rooms = {};

io.on("connection", socket => {
  console.log("user connected", socket.id);

  let curRoom = null;

  socket.on("joinRoom", data => {
    const { room } = data;

    if (!rooms[room]) {
      rooms[room] = {
        name: room,
        occupants: {},
      };
    }

    const joinedTime = Date.now();
    rooms[room].occupants[socket.id] = joinedTime;
    curRoom = room;

    console.log(`${socket.id} joined room ${room}`);
    socket.join(room);

    socket.emit("connectSuccess", { joinedTime });
    const occupants = rooms[room].occupants;
    io.in(curRoom).emit("occupantsChanged", { occupants });
  });

  socket.on("send", data => {
    io.to(data.to).emit("send", data);
  });

  socket.on("broadcast", data => {
    socket.to(curRoom).broadcast.emit("broadcast", data);
  });

  socket.on("disconnect", () => {
    console.log('disconnected: ', socket.id, curRoom);
    if (rooms[curRoom]) {
      console.log("user disconnected", socket.id);

      delete rooms[curRoom].occupants[socket.id];
      const occupants = rooms[curRoom].occupants;
      socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });

      if (occupants == {}) {
        console.log("everybody left room");
        delete rooms[curRoom];
      }
    }
  });
});

app.use(express.urlencoded({
  extended: true
}))

app.get('/', function(req, res){
  res.render('index')
})

app.get('/room', function(req, res){
  // res.render('room')
  res.send('this is illegal')
})

app.post('/room', upload.none(), function(req, res){
  
  res.render('room', { color: req.body.color, room_code: req.body.room_code})
})

app.get('/caretaker', function(req, res){
  console.log('caretaker: curr_room_code', curr_room_code)
  res.render('caretaker', {room_code: curr_room_code})
})

app.get('/patient', function(req, res){
  res.render('patient')
})

app.post('/join-room', upload.none(), function(req,res){
  
  // query db, get room details
  // add error handling

  res.render('room', {room_code: req.body.room_code})
})

// app.post('/test', upload.none(), function(req, res, next){
//   console.log(req.body.color)
//   res.send(req.body.color)
// })

app.post('/upload', upload.single("picture_1", 1), function(req, res){
  console.log('req body')
  console.log(req.body)
  console.log('wait eto')
  console.log(req.body.room_code)
  console.log('old curr_room_code', curr_room_code)
  curr_room_code = nanoid.nanoid(10)
  console.log('new curr_room_code', curr_room_code)

  res.send(`success ${curr_room_code}`)
})

webServer.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});


