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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  quantity: {
    type: Number,
    default: 1,
  },
   color: {
    type: String,
    require :true,
   
  },
  brand: {
    type: String,
    require :true,
   
  },
  variant: {
    type: String,
    require :true,
   
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
