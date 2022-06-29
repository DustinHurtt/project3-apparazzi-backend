const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: String,
    name: String,
    bio: String,
    imageUrl: String,
    location: String,
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
