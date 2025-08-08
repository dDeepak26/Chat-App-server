const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMessages,
  sendMessage,
  getAllUserForSideBar,
} = require("../controller/MessageController");

// get other users for sidebar
router.get("/other-user", authMiddleware, getAllUserForSideBar);

// get messages
router.get("/get/:id", authMiddleware, getMessages);

// send messages
router.post("/send/:id", authMiddleware, sendMessage);

module.exports = router;
