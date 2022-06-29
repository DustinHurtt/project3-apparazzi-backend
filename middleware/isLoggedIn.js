const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || token === "null") {
    return res.status(400).json({ message: "Token not found" });
  }
  try {
    const tokenInfo = jwt.verify(token, process.env.SECRET);
    req.user = tokenInfo;
    next();
  } catch (error) {
    return res.json(error);
  }
};

module.exports = isLoggedIn;
