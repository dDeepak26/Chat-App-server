const mongoose = require("mongoose");

const DbConnect = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/"
    );
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error("Error in Connecting to the MongoDb");
  }
};

module.exports = DbConnect;
