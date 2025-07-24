const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,  
  },

  // Add Stripe related fields
stripe_payment_intent_id: {
    type: String,
  },
  amount: {
    type: Number,
  },
  currency: {
    type: String,
  },
  status: {
    type: String,
  },
  payment_method: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{timestamps:true});

module.exports = mongoose.model("Payment", paymentSchema);
