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
    photographedDate: String,
    contributor: {type: Schema.Types.ObjectId,
          ref: "User",
          required: true}

  },
  {
    timestamps: true
  }
);
 
module.exports = model('Photo', photoSchema);