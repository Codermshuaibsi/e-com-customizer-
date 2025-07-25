require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const dbConnect = require("./config/database"); // ✅ ya ./config/dbConnect (jo sahi file ho)

const { cloudinaryConnect } = require("./config/cloudinary");

// DB connect
dbConnect();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,              
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp",
}));

// Cloudinary
cloudinaryConnect();

// Routes import
const user = require("./routers/userRouter");
const product = require("./routers/productRouter");
const order = require("./routers/orderRouter");
const cart = require("./routers/cartRouter");
const coupon = require("./routers/cuponRouter");
const Payments = require("./routers/PaymentsRouter");
const admin = require("./routers/adminRoutes");
const ShippingAddress = require("./routers/ShippingAddressRoutes")
// Routes declaration
app.use("/api/v1", user); 
app.use("/api/v1", product);
app.use("/api/v1", order);
app.use("/api/v1", ShippingAddress);
app.use("/api/v1", cart);  
app.use("/api/v1", coupon);
app.use("/api/v1/payment", Payments); 
app.use("/api/v1/admin", admin);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
