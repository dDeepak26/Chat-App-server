const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { RoomModel } = require("../model/RoomModel");
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// to store the active user id
let activeUsers = {};

io.on("connection", async (socket) => {
  console.log("user connected with Id: ", socket.id);

  // making user to join the chatApp room universal
  socket.join("ChatApp");

  // getting userId from client and making them to join their own room
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    activeUsers[userId] = socket.id;
  }

  // get room and make user join the room to persist login/logout

  // getting the user joined room from db
  const rooms = await RoomModel.find({
    users: userId,
  });

  // making user to join all the room
  rooms.forEach((room) => {
    socket.join(room.roomName);
    console.log(
      `By socket connection with socketId ${socket.id} User ${userId} joined room ${room.roomName}`
    );
  });

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
  activeUsers,
};
