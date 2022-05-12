const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const photoSchema = new Schema(
  {
    description: String,
    tags: Array,
    postDate: String,
    imageUrl: String,
    cloudinary_id: String,
    latitude: String,
    longitude: String,
    createDate: String,

  },
  {
    timestamps: true
  }
);
 
module.exports = model('Photo', photoSchema);