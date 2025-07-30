const Discount = require("../models/DiscountModel");
const Product = require("../models/productModel");

exports.createDiscount = async (req, res) => {
  if (
    !req.body.product ||
    !req.body.discountType ||
    !req.body.discountValue ||
    !req.body.validFrom ||
    !req.body.validTo
  ) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const discount = new Discount(req.body);
    await discount.save();

    const product = await Product.findById(req.body.product);
    if (product) {
      let newPrice = product.price;
      if (req.body.discountType === "percentage") {
        newPrice = product.price - (product.price * req.body.discountValue / 100);
      } else if (req.body.discountType === "fixed") {
        newPrice = product.price - req.body.discountValue;
      }
      product.discountedPrice = newPrice > 0 ? newPrice : 0;;
      await product.save();
    }

    return res.status(201).json({ success: true, data: discount });

  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
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
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Discount deleted" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
