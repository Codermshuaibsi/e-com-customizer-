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

/** http://localhost:4000/api/v1/orders/..... */

router.post("/orders/add-order", createOrder);

router.get("/orders/orderHistory", auth, fetchOrderHistory);

router.get("/orders/all-orders", fetchOrders)


router.get("/orders/:orderId", fetchSingleOrder);

router.put("/ordersStatus/:orderId",auth,isAdmin, updateOrder);

router.delete("/orders/:orderId", deleteOrder); 

router.get("/getOrderHistory", auth, fetchOrderHistory);   

// total revenue
router.get("/getDashboardStat",auth,isAdmin,getDashboardStats)


module.exports = router;
