const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  password: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  address: {
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
  },
  favouriteGame: {
    type: String,
    require: true
  },
   thumbnail: {
    type: String, 
    default: "", 
  },
  
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User; 
