var express = require("express");
var router = express.Router();

const Photo = require("../models/Photo.model");
const User = require("../models/User.model");

const cloudinary = require("../middleware/cloudinary");
const upload = require("../middleware/multer");
const isLoggedIn = require("../middleware/isLoggedIn");

let query = [
  {
    path: "comments",
    model: "Comment",
  },
  {
    path: "contributor",
    model: "User",
  },
];

router.post(
  "/new-photo",
  isLoggedIn,
  upload.single("imageUrl"),
  async (req, res) => {
    console.log("Reached new-photo route", req.file.path)
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        image_metadata: true,
      });

      let alternateUrl

      if (result.secure_url.split('.')[3] === 'heic') {
        console.log("WE have an HEIC FILE!!!!!")
        const newResult = await cloudinary.uploader.upload(req.file.path, {
          image_metadata: true,
          format: "jpg"
        });

        alternateUrl = newResult.secure_url
      }

      Photo.create({
        description: req.body.description,
        tags: req.body.tags,
        postDate: result.created_at,
        imageUrl: alternateUrl || result.secure_url,
        cloudinary_id: result.public_id,
        latitude: result.image_metadata.GPSLatitude,
        longitude: result.image_metadata.GPSLongitude,
        photographedDate: result.image_metadata.CreateDate,
        contributor: req.user._id,
      })
        .then((newlyCreatedPhotoFromDB) => {
          res.json({ newlyCreatedPhotoFromDB });
        })
        .catch((error) =>
          console.log(`Error while creating a new photo: ${error}`)
        );
    } catch (err) {
      console.log({errorMessage: "Error posting photo", err});
    }
  }
);

router.post("/:id/add-after", isLoggedIn, (req, res, next) => {
  Photo.findByIdAndUpdate(req.params.id, {
    description: req.body.description,
    tags: req.body.tags,
  })

    .then(function (updatedPhoto) {
      res.json(updatedPhoto);
    })
    .catch(function (error) {
      res.json(error);
    });
});

router.get("/all-photos", (req, res) => {
  Photo.find()
    .populate({
      path: "contributor",
    })
    .then((photosFromDB) => {
      res.json({ photos: photosFromDB });
    })
    .catch((err) =>
      console.log(`Error while getting the photos from the DB: ${err}`)
    );
});

router.get("/:id/tag", (req, res) => {
  Photo.find({ tags: { $in: [`${req.params.id}`] } })
    .populate({
      path: "contributor",
    })
    .then((photosFromDB) => {
      res.json({ photos: photosFromDB });
    })
    .catch((err) =>
      console.log(`Error while getting the photos from the DB: ${err}`)
    );
});

router.get("/:/user-photos", (req, res) => {
  Photo.find()
    .then((photosFromDB) => {
      res.json({ photos: photosFromDB });
    })
    .catch((err) =>
      console.log(`Error while getting the photos from the DB: ${err}`)
    );
});

router.get("/:id/contributor", (req, res, next) => {
  User.findById(req.params.id)
    .then(function (foundUser) {
      Photo.find({ contributor: req.params.id })
        .populate({
          path: "contributor",
        })
        .then(function (foundPhotos) {
          res.json({ foundUser: foundUser, foundPhotos: foundPhotos });
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.get("/:id/details", (req, res, next) => {
  Photo.findById(req.params.id)
    .populate({ path: "contributor" })
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })

    .then(function (result) {
      res.json({ result });
    })
    .catch(function (error) {
      res.json(error);
    });
});

router.post("/:id/delete", (req, res, next) => {
  Photo.findByIdAndRemove(req.params.id)
    .then(function () {
      res.json({ message: "photo deleted" });
    })
    .catch(function (error) {
      res.json(error);
    });
});

router.post("/:id/edit", (req, res, next) => {
  Photo.findByIdAndUpdate(req.params.id, { ...req.body })
    .then(function () {
      res.json({ message: "updated" });
    })
    .catch(function (error) {
      res.json(error);
    });
});

module.exports = router;
