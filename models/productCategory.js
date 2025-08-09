const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: String,
    default: ""
  },
  // sub category
  subCategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
