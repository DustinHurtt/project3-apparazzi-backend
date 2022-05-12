// const cloudinary = require('cloudinary');
// const dotenv = require('dotenv');

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET
// })

// exports.uploads = (file, folder) => {
//   return new Promise(resolve => {
//     cloudinary.uploader.upload(file, (result) => {
//       resolve({
//         url: result.url,
//         id: result.public_id
//       })
//     }, {
//       resource_type: "auto",
//       folder: folder
//     })
//   })








// const { config, uploader } = require ('cloudinary').v2;



// const cloudinaryConfig = (req, res, next) => {config({
// cloud_name: process.env.CLOUDINARY_NAME,
// api_key: process.env.CLOUDINARY_KEY,
// api_secret: process.env.CLOUDINARY_SECRET,
// });
// next()
// }
// module.exports = { cloudinaryConfig, uploader };








// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');
 
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET
// });
 

// const storage = new CloudinaryStorage({
//   // cloudinary: cloudinary,
//   cloudinary,
//   params: {
//     allowed_formats: ['jpg', 'png', 'jpeg'],
//     folder: 'movie-project' // The name of the folder in cloudinary
//     // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
//     ,
    
//     image_metadata: true,
//     exif: true,
//   },
//   image_metadata: true
  
// });
 
// //                     storage: storage
// module.exports = multer({ storage });