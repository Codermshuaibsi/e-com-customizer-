const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    default: 0,
  },
  images: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  cart: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  color: {
    type: String,
    require: true,

  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variation",
    required: true,
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subCategory",
  },
  isCustom: {
    type: Boolean,
    default: false
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;  
