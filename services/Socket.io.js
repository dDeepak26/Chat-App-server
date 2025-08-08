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

io.on("connection", (socket) => {
  console.log("user connected with Id: ", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected with Id: ", socket.id);
  });
});

module.exports = {
  server,
  io,
  app,
};
