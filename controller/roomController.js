const addUserToRoom = async (req, res) => {
  try {
    const data = req.body;
  } catch (err) {
    console.error("error in add user to room");
    res.status(500).json({ errMsg: "error in add user to room" });
  }
};
