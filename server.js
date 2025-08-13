const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const DbConnect = require("./config/DbConnect");

// socket imports
const { server, app } = require("./services/Socket.io");

// router imports
const authRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const roomRouter = require("./routes/RoomRoutes");
const chatRoomRouter = require("./routes/chatRoomRouter");

const PORT = process.env.PORT || 8080;

// necessary middleware
// cors configured for development only
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded());

// all routes
app.use("/auth", authRouter);
app.use("/message", messageRouter);
app.use("/room", roomRouter);
app.use("/chatroom", chatRoomRouter);

// first test route
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", msg: "first index route" });
});

// server config
server.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
  // db connect
  DbConnect();
});
