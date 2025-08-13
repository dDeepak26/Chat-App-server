const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createRoom,
  getJoinedRooms,
  addRemoveUserToRoom,
} = require("../controller/roomController");

// to create room
router.post("/", createRoom);

// get joined room by userId
router.get("/", authMiddleware, getJoinedRooms);

// add or remove user
router.put("/:name", addRemoveUserToRoom);

module.exports = router;
