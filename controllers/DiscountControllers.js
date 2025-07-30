const Product = require('../models/productModel'); // Adjust path as needed
const Discount = require('../models/Discount'); // Adjust path as needed

// CREATE DISCOUNT - Updates product priceexports.createDiscount = async (req, res) => {
if (!req.body.product || !req.body.discountType || !req.body.discountValue || !req.body.validFrom || !req.body.validTo) {
  return res.status(400).json({ success: false, message: "All fields are required" });
}

try {
  // 1. Find the product
  const product = await Product.findById(req.body.product);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  // 2. Check if product already has an active discount
  if (product.isDiscounted) {
    return res.status(400).json({
      success: false,
      message: "Product already has an active discount. Please remove existing discount first."
    });
  }

  // 3. Store original price if not already stored
  if (!product.originalPrice) {
    product.originalPrice = product.price;
  }

  // 4. Calculate discounted price
  let discountedPrice;
  if (req.body.discountType === 'percentage') {
    discountedPrice = product.originalPrice - (product.originalPrice * req.body.discountValue / 100);
  } else if (req.body.discountType === 'fixed') {
    discountedPrice = product.originalPrice - req.body.discountValue;
  } else {
    return res.status(400).json({ success: false, message: "Invalid discount type. Use 'percentage' or 'fixed'" });
  }

  // 5. Ensure discounted price is not negative
  if (discountedPrice < 0) {
    return res.status(400).json({
      success: false,
      message: "Discount value too high. Discounted price cannot be negative."
    });
  }

  // 6. Create discount record
  const discount = new Discount(req.body);
  await discount.save();

  // 7. Update product with discounted price
  product.price = Math.round(discountedPrice * 100) / 100; // Round to 2 decimal places
  product.isDiscounted = true;
  product.activeDiscountId = discount._id;
  await product.save();

  res.status(201).json({
    success: true,
    data: discount,
    message: `Discount applied! Product price updated from ₹${product.originalPrice} to ₹${product.price}`
  });

} catch (err) {
  res.status(400).json({ success: false, error: err.message });
}
};

// DELETE/REMOVE DISCOUNT - Restores original price
exports.deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the discount
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ success: false, message: "Discount not found" });
    }

    // 2. Find the associated product
    const product = await Product.findById(discount.product);
    if (!product) {
      return res.status(404).json({ success: false, message: "Associated product not found" });
    }

    // 3. Restore original price
    if (product.originalPrice) {
      product.price = product.originalPrice;
    }
    product.isDiscounted = false;
    product.activeDiscountId = null;
    await product.save();

    // 4. Delete the discount record
    await Discount.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Discount removed! Product price restored to ₹${product.price}`
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// UPDATE DISCOUNT - Recalculates and updates product price
exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find existing discount
    const existingDiscount = await Discount.findById(id);
    if (!existingDiscount) {
      return res.status(404).json({ success: false, message: "Discount not found" });
    }

    // 2. Find the associated product
    const product = await Product.findById(existingDiscount.product);
    if (!product) {
      return res.status(404).json({ success: false, message: "Associated product not found" });
    }

    // 3. Update discount record
    const updatedDiscount = await Discount.findByIdAndUpdate(id, req.body, { new: true });

    // 4. Recalculate price with new discount values
    let newDiscountedPrice;
    if (updatedDiscount.discountType === 'percentage') {
      newDiscountedPrice = product.originalPrice - (product.originalPrice * updatedDiscount.discountValue / 100);
    } else if (updatedDiscount.discountType === 'fixed') {
      newDiscountedPrice = product.originalPrice - updatedDiscount.discountValue;
    }

    // 5. Ensure new price is not negative
    if (newDiscountedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "New discount value too high. Discounted price cannot be negative."
      });
    }

    // 6. Update product price
    product.price = Math.round(newDiscountedPrice * 100) / 100;
    await product.save();

    res.status(200).json({
      success: true,
      data: updatedDiscount,
      message: `Discount updated! New product price: ₹${product.price}`
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET ALL DISCOUNTS WITH PRODUCT DETAILS
exports.getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().populate('product', 'title originalPrice price isDiscounted');
    res.status(200).json({ success: true, data: discounts });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// SCHEDULED FUNCTION - Check and apply/remove discounts based on validity dates
exports.checkDiscountValidity = async () => {
  try {
    const now = new Date();

    // Find discounts that should be active but aren't applied yet
    const discountsToActivate = await Discount.find({
      validFrom: { $lte: now },
      validTo: { $gte: now },
      // Add a field to track if discount is currently applied
    });

    // Find discounts that have expired
    const expiredDiscounts = await Discount.find({
      validTo: { $lt: now }
    });

    // Apply active discounts
    for (let discount of discountsToActivate) {
      const product = await Product.findById(discount.product);
      if (product && !product.isDiscounted) {
        // Apply discount logic here (similar to createDiscount)
      }
    }

    // Remove expired discounts
    for (let discount of expiredDiscounts) {
      const product = await Product.findById(discount.product);
      if (product && product.activeDiscountId && product.activeDiscountId.toString() === discount._id.toString()) {
        // Restore original price
        product.price = product.originalPrice;
        product.isDiscounted = false;
        product.activeDiscountId = null;
        await product.save();

        // Delete expired discount
        await Discount.findByIdAndDelete(discount._id);
      }
    }

    console.log(`Processed ${discountsToActivate.length} active discounts and ${expiredDiscounts.length} expired discounts`);
  } catch (err) {
    console.error('Error checking discount validity:', err);
  }
};