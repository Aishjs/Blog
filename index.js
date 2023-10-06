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

//we use a set to store users, sets objects are for unique values of any type
const activeUsers = new Set();

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("newuser", function (username) {
    socket.userId = username;
    activeUsers.add(username);
    //... is the the spread operator, adds to the set while retaining what was in there already
    io.emit("new user", [...activeUsers]);
    // Broadcast a message to inform others that the user has joined
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  socket.on("exituser", function (username) {
    // Remove the user from the activeUsers array
    const index = activeUsers.indexOf(username);
    if (index !== -1) {
      activeUsers.splice(index, 1);
    }
    // Broadcast the updated active users list to all clients
    socket.broadcast.emit("activeusers", activeUsers);

    // Broadcast a message to inform others that the user has left
    socket.broadcast.emit("update", username + " left the conversation");
  });

  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });
});