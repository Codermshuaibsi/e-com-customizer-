const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Tax = mongoose.model("Tax", taxSchema);
module.exports = Tax;
