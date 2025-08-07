const mongoose = require("mongoose");

const variationSchema = new mongoose.Schema({
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

const Variation = mongoose.model("Variation", variationSchema);
module.exports = Variation;
