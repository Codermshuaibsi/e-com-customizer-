const instance = require("../config/razorpay");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");
// const shippingAddress1 = require("../models/ShippingAddress");
const addressmodel = require("../models/ShippingAddress ");
const nodemailer = require("nodemailer");

const stripe = require("../config/strippay");

// working   properly stripe
exports.capturePayment = async (req, res) => {
  try {
    const { products, amount, address, addressId } = req.body;
    console.log(address, addressId, amount, products);
    const userId = req.user.id;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide product IDs in an array",
      });
    }

    const amountInPaise = Math.round(amount * 100); // Stripe needs amount in paise

    if (!amountInPaise || amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least ₹1",
      });
    }

    const productIds = [];
    for (const productId of products) {
      if (mongoose.Types.ObjectId.isValid(productId)) {
        productIds.push(new mongoose.Types.ObjectId(productId));
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID provided: " + productId,
        });
      }
    }

    // const shippingAddressDoc = await addressmodel.findById(addressId);

    // if (!shippingAddressDoc) {
    //   return res.status(404).json({ success: false, message: "Address not found" });
    // }

    // // Extract necessary fields
    // const shippingAddress = {
    //   fullName: shippingAddressDoc.fullName,
    //   phone: shippingAddressDoc.phone,
    //   state: shippingAddressDoc.state,
    //   city: shippingAddressDoc.city,
    //   pincode: shippingAddressDoc.pincode,
    //   address: shippingAddressDoc.address,
    //   landmark: shippingAddressDoc.landmark,
    //   country: shippingAddressDoc.country,
    // };

    // console.log(shippingAddress);

    if (amountInPaise > 999999999) {
      return res.status(400).json({
        success: false,
        message:
          "Amount exceeds Stripe's maximum allowed value (₹99,99,999.99)",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: "inr",
      metadata: {
        userId,
        products: products.join(","),
      },
      automatic_payment_methods: { enabled: true },
    });

    // const order = new Order({
    //   userId,
    //   totalAmount: amountInPaise,
    //   products: productIds,
    //   shippingAddress,
    // });

    // await order.save();

    res.status(200).json({
      success: true,
      message: "Payment intent created",
      clientSecret: paymentIntent.client_secret,
    });


    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Capture Payment Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// stripe
exports.verifyPayment = async (req, res) => {
  try {
    const { products, paymentIntentId, addressId, amount } = req.body;
    const userId = req.user.id;

    if (!paymentIntentId || !addressId || !amount || !products || !products.length) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: `Payment not successful. Status: ${paymentIntent.status}`,
      });
    }

    // Save payment
    await Payment.create({
      stripe_payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      user: userId,
      status: paymentIntent.status,
      payment_method: paymentIntent.payment_method,
    });

    // Validate amount
    const amountInPaise = Math.round(amount * 100);
    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least ₹1",
      });
    }

    // Validate and prepare order items
    const orderItems = [];
    for (const item of products) {
      const { productId, quantity } = item;
      if (!mongoose.Types.ObjectId.isValid(productId) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid product or quantity for product ID: ${productId}`,
        });
      }
      orderItems.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity,
      });
    }

    const shippingAddressDoc = await addressmodel.findById(addressId);
    if (!shippingAddressDoc) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const shippingAddress = {
      fullName: shippingAddressDoc.fullName,
      phone: shippingAddressDoc.phone,
      state: shippingAddressDoc.state,
      city: shippingAddressDoc.city,
      pincode: shippingAddressDoc.pincode,
      address: shippingAddressDoc.address,
      landmark: shippingAddressDoc.landmark || "N/A",
      country: shippingAddressDoc.country,
    };

    const order = new Order({
      userId,
      totalAmount: amount,
      products: orderItems,
      shippingAddress,
      paymentMethod: "Stripe",
      orderStatus: "Processing",
    });

    await order.save();

    const populatedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          name: product?.title || "Unknown Product",
          quantity: item.quantity,
        };
      })
    );

    const user = await User.findById(userId);

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailContent = `
      <h2>Hi ${user.firstName} ${user.lastName},</h2>
      <p>Thank you for your purchase! Your payment of ₹${amount} has been received successfully.</p>
      <p>We are processing your order and will notify you once it is shipped.</p>
      <h3>Order Details:</h3>
      <ul>
        ${populatedOrderItems
        .map(
          (item) =>
            `<li>Product ID: ${item.name} - Quantity: ${item.quantity}</li>`
        )
        .join("")}
      </ul>
      <p><b>Shipping Address:</b> ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.pincode}</p>
      <p>Thank you for shopping with us!</p>
    `;

    await transporter.sendMail({
      from: "amanpal6000@gmail.com",
      to: user.email,
      subject: "Order Confirmation - Customizer",
      html: emailContent,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and order created successfully",
    });
  } catch (error) {
    console.error("verifyPayment error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while verifying payment",
    });
  }
};

// Place COD Order
exports.placeCodOrder = async (req, res) => {
  try {
    const { products, amount, addressId } = req.body;
    const userId = req.user.id;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid product list" });
    }

    if (!addressId) {
      return res.status(400).json({ success: false, message: "Address ID is required" });
    }

    // Validate and format products
    const formattedProducts = products.map((item) => {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) throw new Error(`Invalid product ID: ${item.productId}`);
      return {
        productId: new mongoose.Types.ObjectId(item.productId),
        quantity: item.quantity,
      };
    });

    const addressDoc = await addressmodel.findById(addressId);
    if (!addressDoc) return res.status(404).json({ success: false, message: "Address not found" });

    const shippingAddress = {
      fullName: addressDoc.fullName,
      phone: addressDoc.phone,
      state: addressDoc.state,
      city: addressDoc.city,
      pincode: addressDoc.pincode,
      address: addressDoc.address,
      country: addressDoc.country,
    };

    const newOrder = new Order({
      userId,
      products: formattedProducts,
      totalAmount: amount * 100,
      shippingAddress,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    await newOrder.save();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 🔴 FETCH PRODUCT DETAILS
    const populatedProducts = await Promise.all(
      formattedProducts.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          name: product?.title || "Product Name",
          quantity: item.quantity,
        };
      })
    );

    // 🔴 SEND EMAIL
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Order Confirmation - Cash on Delivery",
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order ID is <strong>${newOrder._id}</strong>.</p>
        <h3>Products:</h3>
        <ul>
          ${populatedProducts.map(p => `<li>${p.name} - Quantity: ${p.quantity}</li>`).join("")}
        </ul>
        <p><strong>Total:</strong> ₹${amount}</p>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
        <p>We will deliver your order to the following address:</p>
        <p>${shippingAddress.fullName}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}, ${shippingAddress.country}</p>
        <p>Phone: ${shippingAddress.phone}</p>
        <br/>
        <p>Thanks for shopping with us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "Order placed successfully via COD", orderId: newOrder._id });

  } catch (error) {
    console.error("COD order error:", error);
    res.status(500).json({ success: false, message: "Failed to place COD order" });
  }
};


// exports.capturePayment = async (req, res) => {
//   try {
//     const { products, amount } = req.body;

//     // Validate products
//     if (!Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({ success: false, message: "Please provide product IDs in an array" });
//     }

//     const userId = req.user.id;

//     // Convert product IDs to ObjectId
//     const productIds = products.map(productId => new mongoose.Types.ObjectId(productId));

//     // Fetch user details
//     const userDetails = await User.findById(userId);
//     if (!userDetails || !userDetails.address) {
//       return res.status(404).json({ success: false, message: "User or address not found" });
//     }

//     const shippingAddress = userDetails.address.addressLine || "No address provided";

//     // Create Razorpay order
//     const options = {
//       amount: amount ,
//       currency: "INR",
//       receipt: `rcpt_${Date.now()}`
//     };

//     const paymentResponse = await instance.orders.create(options);

//     // Save order in DB
//     const order = new Order({
//       userId,
//       totalAmount: options.amount,
//       products: productIds,
//       shippingAddress
//     });

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Payment initiated successfully",
//       order: paymentResponse
//     });

//   } catch (error) {
//     console.error("Capture Payment Error:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // working properly
// exports.verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     const userId = req.user.id;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Missing payment details" });
//     }

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature === razorpay_signature) {
//       await Payment.create({
//         razorpay_order_id,
//         razorpay_signature,
//         razorpay_payment_id,
//         user: new mongoose.Types.ObjectId(userId),
//       });

//       return res.status(200).json({
//         success: true,
//         message: "Payment verified and saved successfully",
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Payment verification failed (invalid signature)",
//       });
//     }
//   } catch (error) {
//     console.error("verifyPayment error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error while verifying payment",
//     });
//   }
// };

// working properly
exports.fetchAllPayments = async (req, res) => {
  try {
    const allPayments = await Payment.find({}).populate("user");
    return res.status(200).json({
      success: true,
      allPayments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
