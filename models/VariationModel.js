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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Variation = mongoose.model("Variation", variationSchema);
module.exports = Variation;
