const express = require("express");
const router = express.Router();
const {
  subscribe,
  getAllSubscribers,
  deleteSubscriber,
} = require("../controllers/newsletterController");

const { auth, isAdmin } = require("../middleware/auth");

// 👉 Public Route
router.post("/subscribe", subscribe);

// 👉 Admin Routes
router.get("/subscribers", auth, isAdmin, getAllSubscribers);
router.delete("/subscriber/:id", auth, isAdmin, deleteSubscriber);

module.exports = router;
