const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// to store the active user id
let activeUsers = {};

io.on("connection", (socket) => {
  console.log("user connected with Id: ", socket.id);

  // making user to join the chatApp room
  socket.join("chatApp");

  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    activeUsers[userId] = socket.id;
  }

  // emitting the active user list
  io.emit("getOnlineUsers", Object.keys(activeUsers));

  socket.on("disconnect", () => {
    console.log("user disconnected with Id: ", socket.id);
    delete activeUsers[userId];
    io.emit("getOnlineUsers", Object.keys(activeUsers));
  });
});

module.exports = {
  server,
  io,
  app,
};
