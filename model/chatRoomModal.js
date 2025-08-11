const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    chatRoomName: {
      type: String,
      trim: true,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
    //   users: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "users",
    //       required: true,
    //     },
    //   ],
  },
  { timestamps: true }
);

module.exports = {
  chatRoomModal: mongoose.model("chat rooms", chatRoomSchema),
};
