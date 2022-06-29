var express = require("express");
var router = express.Router();

const User = require("../models/User.model");
const Photo = require("../models/Photo.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
require("dotenv/config");

const isLoggedIn = require("../middleware/isLoggedIn");

const cloudinary = require("../middleware/cloudinary");
const upload = require("../middleware/multer");

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

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
            const payload = { _id: createdUser._id };

            const token = jwt.sign(payload, process.env.SECRET, {
              algorithm: "HS256",
              expiresIn: "24hr",
            });
            res.json({ token: token, id: createdUser._id });
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
        const payload = { _id: foundUser._id };

        const token = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "24hr",
        });
        res.json({ token: token, id: foundUser._id });
      } else {
        return res.json({ message: "Username or Password is incorrect" });
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.get("/login-test", isLoggedIn, (req, res) => {
  res.json({ message: "You are logged in" });
});

router.post(
  "/edit-profile-with-picture",
  isLoggedIn,
  upload.single("imageUrl"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);

      User.findByIdAndUpdate(req.user._id, {
        imageUrl: result.secure_url,
      })
        .then((newlyCreatedProfile) => {
          res.json({ newlyCreatedProfile });
        })
        .catch((error) =>
          console.log(`Error while creating a new profile: ${error}`)
        );
    } catch (err) {
      console.log(err);
    }
  }
);

router.post("/edit-profile-without-picture", isLoggedIn, (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { ...req.body }, { new: true })
    .then(function (updatedProfile) {
      res.json(updatedProfile);
    })
    .catch(function (error) {
      res.json(error);
    });
});

router.get("/my-profile", isLoggedIn, (req, res, next) => {
  User.findById(req.user._id)
    .then(function (foundUser) {
      Photo.find({ contributor: req.user._id })
        .populate({ path: "contributor" })
        .then(function (foundPhotos) {
          res.json({ foundUser: foundUser, foundPhotos: foundPhotos });
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/delete-profile", isLoggedIn, (req, res, next) => {
  User.findById(req.user._id)
    .then((foundUser) => {
      const doesMatch = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );
      if (doesMatch) {
        foundUser.delete();
        res.json({ message: "success" });
      } else {
        res.status(401).json({ message: "password doesn't match" });
      }
    })
    .catch((error) => {
      res.status(400).json(error.message);
    });
});

module.exports = router;
