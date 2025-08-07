const express = require("express");
const router = express.Router();

const {
  createOrder,
  fetchOrders,
  fetchOrderHistory,
  fetchSingleOrder,
  updateOrder,
  deleteOrder,
  getDashboardStats
} = require("../controllers/OrderController");

const { isAdmin, isUser, auth } = require("../middleware/auth");

/** http://localhost:4000/api/v1/orders/... */

// ✅ Any logged-in user can create an order
router.post("/orders/add-order", auth, isUser, createOrder);

// ✅ Order history for logged-in users
router.get("/orders/orderHistory", auth, isUser, fetchOrderHistory);

// ✅ Admin only: Get all orders
router.get("/orders/all-orders", auth, isAdmin, fetchOrders);

// ✅ Admin only: Get a single order by ID
router.get("/orders/:orderId", auth, isAdmin, fetchSingleOrder);

// ✅ Admin only: Update order status
router.put("/ordersStatus/:orderId", auth, isAdmin, updateOrder);

// ✅ Admin only: Delete an order
router.delete("/orders/:orderId", auth, isAdmin, deleteOrder);

// ✅ Duplicate route for order history — either remove or keep one
router.get("/getOrderHistory", auth, isUser, fetchOrderHistory);

// ✅ Admin only: Dashboard statistics
router.get("/getDashboardStat", auth, isAdmin, getDashboardStats);

module.exports = router;
