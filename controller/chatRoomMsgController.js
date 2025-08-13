const { chatRoomMsgModel } = require("../model/chatRoomMsgModel");
const { io } = require("../services/Socket.io");

// send messages
const broadcastMessageToRoom = async (req, res) => {
  try {
    // data => roomName; senderId middleware; message
    const { _id: senderId } = req.user;
    const data = req.body;
    if (!data || !data.chatRoomName || !data.message) {
      return res
        .status(400)
        .json({ errMsg: "missing field either chatRoomName or message" });
    }

    const newMessage = new chatRoomMsgModel({
      chatRoomName: data.chatRoomName,
      senderId: senderId,
      message: data.message,
    });

    const newMsg = await newMessage.save();

    io.to(data.chatRoomName).emit("chatAppMsg", newMsg);

    res.status(201).json(newMsg);
  } catch (err) {
    console.error("error in sending messages to room", err);
    res.status(500).json({ errMsg: "error in sending messages to room" });
  }
};

// get messages
const getBroadcastMessageOfRoom = async (req, res) => {
  try {
    // get based on chat room name
    const roomName = req.params.name;
    if (!roomName) {
      res.status(400).json({ errMsg: "room name not found in params" });
    }

    const data = await chatRoomMsgModel
      .find({ chatRoomName: roomName })
      .populate("senderId");

    if (!data) {
      return res.status(404).json({ errMsg: "no chat msg found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("error in getting messages of room", err);
    res.status(500).json({ errMsg: "error in getting messages of room" });
  }
};

module.exports = { broadcastMessageToRoom, getBroadcastMessageOfRoom };
