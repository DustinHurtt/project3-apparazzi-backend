var express = require('express');
var router = express.Router();

const Photo = require('../models/Photo.model')

const fileUploader = require('../config/cloudinary.config');
const ExifReader = require('exifreader')


router.post('/create', fileUploader.single('imageUrl', {image_metadata: true}), (req, res) => {
// res.json(req.file)
   
    Photo.create({ imageUrl: req.file.path, metadata: req.file.metadata })
      .then(newlyCreatedPhotoFromDB => {
        res.json({newlyCreatedPhotoFromDB });
        console.log(newlyCreatedPhotoFromDB);
      })
      .catch(error => console.log(`Error while creating a new photo: ${error}`));
  });

// router.post('/create', fileUploader.single('imageUrl', { contex: true, metadata: true, quality_analysis: true }), (req, res) => {
// console.log(req.file)
   
//     // Photo.create({ imageUrl: req.file.path, metadata: req.file.metadata })
//     //   .then(newlyCreatedPhotoFromDB => {
//     //     res.json({newlyCreatedPhotoFromDB });
//     //     console.log(newlyCreatedPhotoFromDB);
//     //   })
//     //   .catch(error => console.log(`Error while creating a new photo: ${error}`));
//   });




router.get('/all-photos', (req, res) => {
    Photo.find()
      .then(photosFromDB => {
        // console.log(moviesFromDB);
        res.json({ photos: photosFromDB });
      })
      .catch(err => console.log(`Error while getting the movies from the DB: ${err}`));
  });





module.exports = router;