const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  broadcastMessageToRoom,
  getBroadcastMessageOfRoom,
} = require("../controller/chatRoomController");

// send msg to all other client
router.post("/send", authMiddleware, broadcastMessageToRoom);

// get all messages
router.get("/", getBroadcastMessageOfRoom);

module.exports = router;
