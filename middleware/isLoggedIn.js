const jwt = require('jsonwebtoken')

const isLoggedIn = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
      if (!token || token === "null") {
        console.log("NO TOKEN");
        return res.status(400).json({ message: "Token not found" });
      }
      try {
        const tokenInfo = jwt.verify(token, process.env.SECRET);
        console.log(tokenInfo);
        //If you have req.payload, change line 12 to:
        //req.payload = tokenInfo;
        req.user = tokenInfo;
        next();
      } catch (error) {
        return res.json(error);
      }
    };

module.exports = isLoggedIn