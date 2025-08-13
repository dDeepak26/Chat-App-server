const { RoomModel } = require("../model/RoomModel");
const { io, activeUsers } = require("../services/Socket.io");

// create room by getting the room name, adminId, usersId[] and joining them to room id active
const createRoom = async (req, res) => {
  try {
    const { roomName, adminUser, users } = req.body;

    if (
      !req.body ||
      !req.body.roomName ||
      !req.body.adminUser ||
      !req.body.users
    ) {
      return res.status(400).json({
        errMsg:
          "missing field either roomName, adminUser, users in request body",
      });
    }

    // checking if room name exists
    const dbRoom = await RoomModel.find({ roomName: roomName });
    if (dbRoom.length > 0) {
      return res.status(409).json({ errMsg: "Room Name already exists" });
    }

    // new room data
    const newRoom = new RoomModel({
      roomName: roomName,
      adminUser: adminUser,
      users: users,
    });

    // saving room document
    const roomData = await newRoom.save();

    // making the active users to join the room
    users.forEach((user) => {
      const socketId = activeUsers[user];
      if (socketId) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket && !socket.rooms.has(roomName)) {
          socket.join(roomName);
          console.log(
            `By CreateRoom Controller User ${user} joined room ${roomName}`
          );
        }
      }
    });

    res.status(201).json(roomData);
  } catch (err) {
    console.error("error in creating room", err);
    res.status(500).json({ errMsg: "error in creating room" });
  }
};

// get joined rooms => userId
const getJoinedRooms = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const rooms = await RoomModel.find({
      users: userId,
    });

    if (rooms.length < 0) {
      return res.status(404).json({ msg: "no room joined" });
    }

    res.status(200).json(rooms);
  } catch (err) {
    console.error("error in getting joined room", err);
    res.status(500).json({ errMsg: "error in getting joined room" });
  }
};

// add/remove users to room by specifying the room Name or id and users Id
// only by room admin
const addRemoveUserToRoom = async (req, res) => {
  // chatRoomName/roomName; usersId[]
  try {
    const roomName = req.params.name;
    const usersId = req.body;

    if (!roomName || usersId.length < 0) {
      return res.status(400).json({
        errMsg: "missing field either roomName, usersId[] in request body",
      });
    }

    const dbRoom = await RoomModel.findOne({ roomName: roomName });
    if (!dbRoom) {
      return res.status(404).json({
        errMsg: "no room found first create it",
      });
    }

    const updatedRoom = await RoomModel.findOneAndUpdate(
      { roomName: roomName },
      {
        users: usersId,
      },
      { new: true }
    );

    // sending response
    res.status(200).json(updatedRoom);

    // updating the connection in socket so that only that user should join the room who are present
    usersId.forEach((user) => {
      const socketId = activeUsers[user];
      if (socketId) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket && !socket.rooms.has(roomName)) {
          socket.join(roomName);
          console.log(
            `By UpdateRoom Controller User ${user} joined room ${roomName}`
          );
        }
      }
    });

    // removing old users
    dbRoom.users.forEach((user) => {
      const nonUserId = !usersId.includes(user);
      if (nonUserId) {
        const socketId = activeUsers[user];
        if (socketId) {
          const socket = io.sockets.sockets.get(socketId);
          if (socket && socket.rooms.has(roomName)) {
            socket.leave(roomName);
            console.log(
              `By UpdateRoom Controller User ${user} Leaved room ${roomName}`
            );
          }
        }
      }
    });
  } catch (err) {
    console.error("error in add user to room", err);
    res.status(500).json({ errMsg: "error in add user to room" });
  }
};

module.exports = { createRoom, getJoinedRooms, addRemoveUserToRoom };
