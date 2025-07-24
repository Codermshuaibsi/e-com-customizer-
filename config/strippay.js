require("dotenv").config(); // Make sure this is at the top
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
