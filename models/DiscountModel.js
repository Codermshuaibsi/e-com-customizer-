const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true }, // percentage or flat value
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
},
{ timestamps: true });

module.exports = mongoose.model("Discount", discountSchema);
