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
  originalPrice: {
    type: Number,
  }
  ,
  thumbnail: [
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
    type: String,
    require: true,

  },
  variant: {
    type: String,
    require: true,

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
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;  
