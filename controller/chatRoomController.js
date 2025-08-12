const { chatRoomModal } = require("../model/chatRoomModal");
const { io } = require("../services/Socket.io");

// send messages
const broadcastMessageToRoom = async (req, res) => {
  try {
    const { _id: senderId } = req.user;
    const roomName = "ChatApp";
    const { message: userMessage } = req.body;

    // TODO add verification and edge case

    const newMessage = new chatRoomModal({
      chatRoomName: roomName,
      senderId: senderId,
      message: userMessage,
    });

    const newMsg = await newMessage.save();

    io.to("chatApp").emit("chatAppMsg", newMsg);

    res.status(201).json(newMsg);
  } catch (err) {
    console.error("error in sending messages to room", err);
    res.status(500).json({ errMsg: "error in sending messages to room" });
  }
};

// get messages
const getBroadcastMessageOfRoom = async (req, res) => {
  try {
    const roomName = "ChatApp";

    // TODO add verification and edge case

    const data = await chatRoomModal.find().populate("senderId");

    res.status(201).json(data);
  } catch (err) {
    console.error("error in sending messages to room", err);
    res.status(500).json({ errMsg: "error in sending messages to room" });
  }
};

module.exports = { broadcastMessageToRoom, getBroadcastMessageOfRoom };
