const mongoose = require("mongoose");


const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: ""
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("SubCategory", subCategorySchema);
