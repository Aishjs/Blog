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

// Initialize an array to store active users
const activeUsers = [];

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("newuser", function (username) {
    // Add the new user to the activeUsers array
    activeUsers.push(username);
    // Broadcast the updated active users list to all clients
    io.emit("activeusers", activeUsers);

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
    io.emit("activeusers", activeUsers);

    // Broadcast a message to inform others that the user has left
    socket.broadcast.emit("update", username + " left the conversation");
  });

  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });
});




// const express = require("express");
// const socket = require("socket.io");
// const path = require("path");


// // App setup
// const PORT = 5000;
// const app = express();
// const server = app.listen(PORT, function () {
//   console.log(`Listening on port ${PORT}`);

// });

// // Static files
// app.use(express.static("public"));

// // Socket setup
// const io = socket(server);
// const activeUsers = new Set();

// io.on("connection", function (socket) {
//   console.log("Made socket connection");

//   socket.on("newuser", function (username) {
//     socket.userName = username;
//     activeUsers.add(username);
//     socket.broadcast.emit("activeusers", activeUsers);
//     socket.broadcast.emit("update" , username +"joined the conversation");
//   });
//   socket.on("exituser", function (username) {
//     socket.broadcast.emit("update", username +"left the conversation");
//   });
//   socket.on("chat", function (message) {
//     socket.broadcast.emit("chat",message);
//   });
// });
