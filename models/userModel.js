const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  address: [{
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    addressLine: {
      type: String,
    },
    city: {
      type: String,
    },
  }],
  favouriteGame: {
    type: String,
    required: true
  },
  images: {
    type: String, 
    default: "", 
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
