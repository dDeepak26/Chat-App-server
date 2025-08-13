const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      trim: true,
      required: true,
    },
    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = {
  RoomModel: mongoose.model("rooms", RoomSchema),
};
