const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const photoSchema = new Schema(
  {
    title: String,
    description: String,
    imageUrl: String,
    metadata: Object
    
  },
  {
    timestamps: true
  }
);
 
module.exports = model('Photo', photoSchema);