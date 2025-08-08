const { MessageModel } = require("../model/MessagesModal");
const { UserModel } = require("../model/UserModel");
const { io } = require("../services/Socket.io");

// get all user for sidebar
const getAllUserForSideBar = async (req, res) => {
  const currUser = req.user;
  try {
    // getting other user
    const otherUsers = await UserModel.find({
      _id: { $ne: currUser._id },
    }).select("-password");

    // sending response
    res.status(200).json(otherUsers);
  } catch (err) {
    console.error("Error in getting the users");
    res
      .status(500)
      .json({ errMsg: "Internal server error Error in getting the users" });
  }
};

// get msg by getting userFromId from params and myId from auth
const getMessages = async (req, res) => {
  const userFromId = req.params.id;
  const { _id: myId } = req.user;
  try {
    // checking if both id is present
    if (!myId || !userFromId) {
      return res
        .status(400)
        .json({ errMsg: "sender or receiver Id is missing" });
    }

    // checking if ids are correct and present in db
    const users = await UserModel.find({
      _id: { $in: [userFromId, myId] },
    });
    if (users.length !== 2) {
      return res
        .status(404)
        .json({ errMsg: "users id not found in db register first" });
    }

    // getting the msg from db
    const msgs = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: userFromId },
        { senderId: userFromId, receiverId: myId },
      ],
    });

    // sending response
    res.status(200).json({ msg: "chats fetched successfully", chats: msgs });
  } catch (err) {
    console.error("Error in getting messages controller: ", err);
    res
      .status(500)
      .json({ errMsg: "Internal server error in getting messages" });
  }
};

// send msg by getting receiverId from params and senderId from auth
const sendMessage = async (req, res) => {
  const { _id: senderId } = req.user;
  const receiverId = req.params.id;

  try {
    // checking if both id is present
    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ errMsg: "sender or receiver Id is missing" });
    }

    // checking if body is present
    if (!req.body || !req.body.message) {
      return res.status(400).json({ errMsg: "text msg is required" });
    }

    // checking if id is correct and present in db
    const users = await UserModel.find({
      _id: { $in: [senderId, receiverId] },
    });
    if (users.length !== 2) {
      return res
        .status(404)
        .json({ errMsg: "users id not found in db register first" });
    }

    // creating new document
    const newMsg = new MessageModel({
      senderId: senderId,
      receiverId: receiverId,
      message: req.body.message,
    });

    // saving msg in db
    newMsg.save();

    // emitting the msg
    io.emit("newMessage", newMsg);

    // resending response
    res.status(201).json({ msg: "msg send", data: newMsg });
  } catch (err) {
    console.error("Error in sendMessage controller: ", err);
    res
      .status(500)
      .json({ errMsg: "Internal server error in sending message" });
  }
};

module.exports = { getAllUserForSideBar, getMessages, sendMessage };
