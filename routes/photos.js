var express = require('express');
var router = express.Router();



const Photo = require('../models/Photo.model')

const cloudinary = require("../middleware/cloudinary");
const upload = require("../middleware/multer");




router.post("/new-photo", upload.single("image"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {image_metadata: true});
     // Create new user
    let photo = new Photo({
      title: req.body.title,
      imageUrl: result.secure_url,
      cloudinary_id: result.public_id,
      latitude: result.image_metadata.GPSLatitude,
      longitude: result.image_metadata.GPSLongitude,
      createDate: result.image_metadata.CreateDate
    });

    Photo.create({ 
      description: req.body.description,
      tags: req.body.tags,
      postDate: result.created_at,
      imageUrl: result.secure_url,
      cloudinary_id: result.public_id,
      latitude: result.image_metadata.GPSLatitude,
      longitude: result.image_metadata.GPSLongitude,
      createDate: result.image_metadata.CreateDate 
    })
    .then(newlyCreatedPhotoFromDB => {
      res.json({newlyCreatedPhotoFromDB });
      console.log(newlyCreatedPhotoFromDB);
    })
    .catch(error => console.log(`Error while creating a new photo: ${error}`));
    // Save user
    await photo.save();
    // res.json(photo);
    // console.log(result)
  } catch (err) {
    console.log(err);
  }


}); 


router.get('/all-photos', (req, res) => {
    Photo.find()
      .then(photosFromDB => {
        // console.log(moviesFromDB);
        res.json({ photos: photosFromDB });
      })
      .catch(err => console.log(`Error while getting the movies from the DB: ${err}`));
  });


router.post('/:id/delete', (req, res, next) => {

    Photo.findByIdAndRemove(req.params.id)
      .then(function () {
        res.json({message: "photo deleted"});
      })
      .catch(function (error) {
        res.json(error);
      });
  });


router.post('/:id/edit', (req, res, next) => {

    Photo.findByIdAndUpdate(req.params.id, {...req.body})
      .then(function () {
        res.json({message: 'updated'});
      })
      .catch(function (error) {
        res.json(error);
      });
  });





module.exports = router;