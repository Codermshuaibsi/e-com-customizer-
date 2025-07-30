const Discount = require("../models/DiscountModel");
const Product = require("../models/productModel");

exports.createDiscount = async (req, res) => {
  const { product, discountType, discountValue, validFrom, validTo } = req.body;

  if (!product || !discountType || !discountValue || !validFrom || !validTo) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const foundProduct = await Product.findById(product);

    if (!foundProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Save original price if not already saved
    if (!foundProduct.originalPrice) {
      foundProduct.originalPrice = foundProduct.price;
    }

    // Apply discount
    if (discountType === "percentage") {
      const discountedPrice = foundProduct.originalPrice - (foundProduct.originalPrice * discountValue / 100);
      foundProduct.price = Math.round(discountedPrice);
    } else if (discountType === "flat") {
      foundProduct.price = foundProduct.originalPrice - discountValue;
    }

    await foundProduct.save();

    const discount = new Discount(req.body);
    await discount.save();

    res.status(201).json({ success: true, data: discount });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};



exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.json({ success: true, data: discounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: discount });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ success: false, message: "Discount not found" });
    }

    const product = await Product.findById(discount.product);
    if (product && product.originalPrice) {
      product.price = product.originalPrice;
      await product.save();
    }

    await Discount.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Discount deleted and product price restored" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
