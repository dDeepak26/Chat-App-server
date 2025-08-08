const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // getting and checking if token is present
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({ errMsg: "unauthorized no token found" });
    }

    // verifying the token with secret key
    const tokenVerify = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!tokenVerify) {
      return res.status(401).json({ errMsg: "invalid token" });
    }
    // sending the response to next
    req.user = tokenVerify;
    next();
  } catch (err) {
    console.error("Error in verifying the user ", err);
    res.status(500).json({ errMsg: "Error in verifying the user", err: err });
  }
};

module.exports = authMiddleware;
