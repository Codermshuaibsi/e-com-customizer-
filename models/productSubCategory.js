const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],   
});

module.exports = mongoose.model("subCategory", subCategorySchema);
