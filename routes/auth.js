var express = require("express");
var router = express.Router();

router.post("/signup", function (req, res, next) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: "please fill out both fields" });
    }
  
    User.findOne({ username: req.body.username })
      .then((foundUser) => {
        if (foundUser) {
          return res.status(400).json({ message: "Username is already taken" });
        } else {
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashedPass = bcrypt.hashSync(req.body.password, salt);
  
          User.create({
            username: req.body.username,
            password: hashedPass,
          })
            .then((createdUser) => {

              const { username, email, name, bio, imageUrl, location, _id } = createdUser

              const payload = { _id, username, email, name, bio, imageUrl, location };
  
              const token = jwt.sign(payload, process.env.SECRET, {
                algorithm: "HS256",
                expiresIn: "24hr",
              });   
  
              res.json(token);
            })
            .catch((err) => {
              res.status(400).json(err.message);
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err.message);
      });
  });
  
  router.post("/login", function (req, res, next) {
    if (!req.body.username || !req.body.password) {
      return res.json({ message: "please fill out both fields" });
    }
  
    User.findOne({ username: req.body.username })
      .then((foundUser) => {
        if (!foundUser) {
          return res.json({ message: "Username or Password is incorrect!!!" });
        }
  
        const doesMatch = bcrypt.compareSync(
          req.body.password,
          foundUser.password
        );
  
        if (doesMatch) {
            
            const { username, email, name, bio, imageUrl, location, _id } = foundUser

            const payload = { _id, username, email, name, bio, imageUrl, location };
  
          const token = jwt.sign(payload, process.env.SECRET, {
            algorithm: "HS256",
            expiresIn: "24hr",
          });
          res.json(token);
        } else {
          return res.json({ message: "Username or Password is incorrect" });
        }
      })
      .catch((err) => {
        res.json(err.message);
      });
  });
  
  router.get("/verify", isLoggedIn, (req, res) => {
    res.json(req.user);
  });

module.exports = router;