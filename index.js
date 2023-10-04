const express = require("express");
const socket = require("socket.io");
const path = require("path");


// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);

});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("newuser", function (username) {
    socket.broadcast.emit("update",username+"joined the conversation");
  });
  socket.on("exituser", function (username) {
    socket.broadcast.emit("update",username+"left the conversation");
  });
  socket.on("chat", function (message) {
    socket.broadcast.emit("chat",message);
  });
});