const path = require("path")
const express = require("express") 
const exphbs = require('express-handlebars')
const roomRoutes = require('./routes/roomRoutes')
const indexRoutes = require('./routes/indexRoutes')
const easyrtc = require('open-easyrtc')
const http = require('http')
const socketIo = require('socket.io')


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

// Start Express http server
var webServer = http.createServer(app);

// Start Socket.io so it attaches itself to Express server
var socketServer = socketIo.listen(webServer, {"log level":1});

var myIceServers = [
  {"url":"stun:stun.l.google.com:19302"},
  {"url":"stun:stun1.l.google.com:19302"},
  {"url":"stun:stun2.l.google.com:19302"},
  {"url":"stun:stun3.l.google.com:19302"}
 
];
easyrtc.setOption("appIceServers", myIceServers);
easyrtc.setOption("logLevel", "debug");
easyrtc.setOption("demosEnable", false);

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});



// Routes Section
app.use('/test', (req, res) => {
  res.render('temp', {room_code: 6969, secret_key: "69420"})
})
app.use(indexRoutes)
app.use('/room', roomRoutes)

//listen on port
webServer.listen(PORT, function () {
  console.log('listening on http://localhost:' + PORT);
});
